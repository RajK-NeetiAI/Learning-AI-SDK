import React, { use } from 'react';

async function fetchFlightData(flightNumber: string) {
    console.log(flightNumber);
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
        status: 'PENDING',
        source: 'GOOGLE',
        destination: 'AHMEDABAD'
    };
};

export function Flight({ flightNumber }: { flightNumber: string }) {
    const data = use(fetchFlightData(flightNumber));
    return (
        <div>
            <div>{flightNumber}</div>
            <div>{data.status}</div>
            <div>{data.source}</div>
            <div>{data.destination}</div>
        </div>
    );
};

export function FlightWithSuspense() {
    return (
        <div className='animate-pulse'>
            <div className='animate-pulse'>XXXX</div>
            <div className='animate-pulse'>STATUS</div>
            <div className='animate-pulse'>SOURCE</div>
            <div className='animate-pulse'>DESTINATION</div>
        </div>
    );
};
