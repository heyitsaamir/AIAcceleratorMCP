import { app, InvocationContext } from "@azure/functions";
import { z } from "zod";

interface StockPrice {
    trading_symbol: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const args = z.object({
    identifier: z.string().describe("The trading symbol for a security (e.g., MSFT)"),
}).describe('Arguments to use to lookup stock prices');

type Args = z.infer<typeof args>;

export async function LookupStock(
    _toolArguments: unknown,
    context: InvocationContext
): Promise<string> {
    const apiKey = process.env.FINANCIAL_DATA_API_KEY;

    if (!apiKey) {
        throw new Error("FINANCIAL_DATA_API_KEY environment variable must be set");
    }

    const mcptoolargs = context.triggerMetadata.mcptoolargs as Args;
    if (!mcptoolargs.identifier) {
        throw new Error("identifier is required");
    }

    let url = `https://financialdata.net/api/v1/stock-prices`;

    const queryParams = new URLSearchParams({
        identifier: mcptoolargs.identifier,
        key: apiKey,
    });

    // if (mcptoolargs.offset !== undefined) {
    //     queryParams.append('offset', mcptoolargs.offset.toString());
    // }

    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Financial Data API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as StockPrice[];
    return JSON.stringify(data);
}

app.mcpTool("lookupStock", {
    toolName: "lookupStock",
    description: "Look up stock price data for a given symbol.",
    toolProperties: args,
    handler: LookupStock,
});
