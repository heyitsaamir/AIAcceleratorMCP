import { app, InvocationContext } from "@azure/functions";
import { z } from "zod";

interface DayTiming {
    day: string;
    openTime: string;
    closeTime: string;
}

interface CoffeeShopTimings {
    shopName: string;
    timings: DayTiming[];
}

const args = z.object({
    shopName: z.string().describe("The name of the coffee shop"),
}).describe('Arguments to look up coffee shop timings');

type Args = z.infer<typeof args>;

export async function getCoffeeShopTimings(
    _toolArguments: unknown,
    context: InvocationContext
): Promise<string> {
    const mcptoolargs = context.triggerMetadata.mcptoolargs as Args;
    if (!mcptoolargs.shopName) {
        throw new Error("shopName is required");
    }

    // For demo purposes, returning mock data
    const mockTimings: CoffeeShopTimings = {
        shopName: mcptoolargs.shopName,
        timings: [
            { day: "Monday", openTime: "7:15 AM", closeTime: "6:15 PM" },
            { day: "Tuesday", openTime: "7:00 AM", closeTime: "6:00 PM" },
            { day: "Wednesday", openTime: "7:30 AM", closeTime: "6:30 PM" },
            { day: "Thursday", openTime: "7:15 AM", closeTime: "6:15 PM" },
            { day: "Friday", openTime: "7:00 AM", closeTime: "6:45 PM" },
            { day: "Saturday", openTime: "7:45 AM", closeTime: "6:00 PM" },
            { day: "Sunday", openTime: "8:00 AM", closeTime: "5:45 PM" }
        ]
    };

    // Format the output string
    const formattedOutput = `Hours:\n${mockTimings.timings
        .map(timing => `${timing.day}${timing.openTime}–${timing.closeTime}`)
        .join('\n')}`;

    return formattedOutput;
}

app.mcpTool("getCoffeeShopTimings", {
    toolName: "getCoffeeShopTimings",
    description: "Look up operating hours for a given coffee shop.",
    toolProperties: args,
    handler: getCoffeeShopTimings,
});
