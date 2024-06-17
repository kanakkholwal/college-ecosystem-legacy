export const possible = [
    {
        pre: "22",
        branch: "bce",
        start: 1,
        end: 124
    },
    {
        pre: "22",
        branch: "bee",
        start: 1,
        end: 125
    },
    {
        pre: "22",
        branch: "bcs",
        start: 1,
        end: 128
    },
    {
        pre: "22",
        branch: "bma",
        start: 1,
        end: 49
    },
    {
        pre: "22",
        branch: "dcs",
        start: 1,
        end: 28
    },
    {
        pre: "22",
        branch: "dec",
        start: 1,
        end: 28
    },
    {
        pre: "22",
        branch: "bph",
        start: 1,
        end: 49
    },
    {
        pre: "22",
        branch: "bch",
        start: 1,
        end: 119
    },
    {
        pre: "22",
        branch: "bms",
        start: 1,
        end: 39
    },
    {
        pre: "22",
        branch: "bme",
        start: 1,
        end: 90
    },
    {
        pre: "22",
        branch: "bar",
        start: 1,
        end: 59
    },
    {
        pre: "22",
        branch: "bec",
        start: 1,
        end: 119
    },
    {
        pre: "23",
        branch: "bce",
        start: 1,
        end: 123
    },
    {
        pre: "23",
        branch: "bme",
        start: 1,
        end: 126
    },
    {
        pre: "23",
        branch: "bph",
        start: 1,
        end: 50
    },
    {
        pre: "23",
        branch: "bph",
        start: 1,
        end: 50
    },
    {
        pre: "23",
        branch: "dcs",
        start: 1,
        end: 28
    },
    {
        pre: "23",
        branch: "dec",
        start: 1,
        end: 28
    },
    {
        pre: "23",
        branch: "bma",
        start: 1,
        end: 50
    },
    {
        pre: "23",
        branch: "bms",
        start: 1,
        end: 40
    },
    {
        pre: "23",
        branch: "bcs",
        start: 1,
        end: 133
    },
    {
        pre: "23",
        branch: "bec",
        start: 1,
        end: 118
    },
    {
        pre: "23",
        branch: "bee",
        start: 1,
        end: 125
    },
    {
        pre: "23",
        branch: "bch",
        start: 1,
        end: 76
    },
    {
        pre: "23",
        branch: "bar",
        start: 1,
        end: 53
    },
]
export function generateValues(array: any[]): string[] {
    const result = [] as string[]

    array.forEach(item => {
        const { branch, start, end, pre } = item;

        for (let i = start; i <= end; i++) {
            // Use padStart to ensure that the numeric part has leading zeros if needed
            const value = `${pre}${branch}${String(i).padStart(3, '0')}`;
            result.push(value);
        }
    });

    return result;
}