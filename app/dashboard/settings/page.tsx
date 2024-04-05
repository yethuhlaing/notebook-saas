import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select"
import prisma from "../../lib/db";
import { Button } from "../../../components/ui/button";
import { revalidatePath } from "next/cache";
import { SubmitButton } from "../../components/SubmitButton";

 
async function getData(userId: string){
    const data = await prisma.user.findUnique( {
        where: {
            id: userId,
        },
        select: {
            name: true,
            email: true,
            colorScheme: true
        },
    })
    return data;
}
export default async function SettingPage(){
    const { getUser } = getKindeServerSession()
    const user = await getUser();
    const data = await getData(user?.id as string);

    async function postData(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const colorScheme = formData.get("color") as string;

        await prisma.user.update({
            where: {
                id: user?.id,
            },
            data: {
                name: name ?? undefined,
                colorScheme: colorScheme ?? undefined,
            },
        });

        revalidatePath("/", "layout");
    }
    return (
        <div className="grid items-start gap-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl">Settings</h1>
                    <p className="text-lg text-muted-foreground">Your Profile Settings</p>
                </div>
            </div>

            <Card>
                <form action={postData}>
                    <CardHeader>
                        <CardTitle>General Data</CardTitle>
                        <CardDescription>Please provide general information about yourself. Please don't forget to save</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label>Your Name</Label>
                                <Input type="text" name="name" id="name" placeholder="Your Name" defaultValue={data?.name as string ?? undefined} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label>Your Email</Label>
                                <Input type="text" name="email" id="email" placeholder="Your Email" disabled defaultValue={data?.email as string ?? undefined} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Color Scheme</Label>
                            <Select name="color" defaultValue={data?.colorScheme as string}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Color</SelectLabel>
                                        <SelectItem value="theme-blue">Blue</SelectItem>
                                        <SelectItem value="theme-violet">Violet</SelectItem>
                                        <SelectItem value="theme-yellow">Yellow</SelectItem>
                                        <SelectItem value="theme-orange">Orange</SelectItem>
                                        <SelectItem value="theme-rose">Rose</SelectItem>
                                        <SelectItem value="theme-green">Green</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}