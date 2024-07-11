async function fetchStocktData({ symbol, numOfMonths }: { symbol: string, numOfMonths: number }) {
    console.log(symbol);
    console.log(numOfMonths);
    await new Promise(resolve => setTimeout(resolve, 3000));
    return [
        {
            date: '8th July 2024',
            value: 110
        },
        {
            date: '9th July 2024',
            value: 120
        },
        {
            date: '10th July 2024',
            value: 130
        }
    ];
};

export async function Stock({ symbol, numOfMonths }: { symbol: string, numOfMonths: number }) {
    const data = await fetchStocktData({ symbol, numOfMonths });
    return (
        <div>
            <div>{symbol}</div>
            <div>
                {data.map(data => (
                    <div>
                        <div>{data.date}</div>
                        <div>{data.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export async function StockWithSuspense() {
    return (
        <div>
            <div>XXXX</div>
            <div>
                <div>
                    <div>XXth XXXX XXXX</div>
                    <div>XXXX</div>
                </div>
            </div>
        </div>
    );
};
