'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const words = [
    'apple',
    'banana',
    'cherry',
    'date',
    'elderberry',
    'fig',
    'grape',
    'honeydew',
    'kiwi',
    'lemon'
];

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
};

export async function continueConversation(messages: CoreMessage[]) {
    const result = await streamText({
        model: openai('gpt-4-turbo'),
        messages,
    });
    const randomWord = getRandomWord();
    const data = { test: randomWord };
    const stream = createStreamableValue(result.textStream);
    return { message: stream.value, data };
};