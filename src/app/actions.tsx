'use server';

import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import { Stock } from '@/app/components/stock';
import { Flight, FlightWithSuspense } from '@/app/components/flight';

export interface ServerMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ClientMessage {
    id: string;
    role: 'user' | 'assistant';
    display: ReactNode;
}

export async function continueConversation(
    input: string,
): Promise<ClientMessage> {
    const history = getMutableAIState();
    const result = await streamUI({
        model: openai('gpt-3.5-turbo'),
        messages: [...history.get(), { role: 'user', content: input }],
        text: ({ content, done }) => {
            if (done) {
                history.done((messages: ServerMessage[]) => [
                    ...messages,
                    { role: 'assistant', content },
                ]);
            }

            return <div>{content}</div>;
        },
        tools: {
            showStockInformation: {
                description:
                    'Get stock information for symbol for the last numOfMonths months',
                parameters: z.object({
                    symbol: z
                        .string()
                        .describe('The stock symbol to get information for'),
                    numOfMonths: z
                        .number()
                        .describe('The number of months to get historical information for'),
                }),
                generate: async ({ symbol, numOfMonths }) => {
                    history.done((messages: ServerMessage[]) => [
                        ...messages,
                        {
                            role: 'assistant',
                            content: `Showing stock information for ${symbol}`,
                        },
                    ]);

                    return <Stock symbol={symbol} numOfMonths={numOfMonths} />;
                },
            },
            showFlightStatus: {
                description: 'Get the status of a flight',
                parameters: z.object({
                    flightNumber: z
                        .string()
                        .describe('The flight number to get status for'),
                }),
                generate: async function* ({ flightNumber }) {
                    yield <FlightWithSuspense></FlightWithSuspense>
                    history.done((messages: ServerMessage[]) => [
                        ...messages,
                        {
                            role: 'assistant',
                            content: `Showing flight status for ${flightNumber}`,
                        },
                    ]);
                    return <Flight flightNumber={flightNumber} />;
                },
            },
        },
    });
    return {
        id: generateId(),
        role: 'assistant',
        display: result.value,
    };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
    actions: {
        continueConversation,
    },
    initialAIState: [],
    initialUIState: [],
});
