import { Button } from "@/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { SubmitButton } from "../../../components/SubmitButton";
import Link from "next/link";
import prisma from "../../../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getData( { userId, noteId}: { userId: string, noteId: string}){
    noStore()
    const data = await prisma.note.findUnique({
        where: {
            id: noteId,
            userId: userId,
        },
        select: {
            title: true,
            description: true,
            id: true
        }
    })
    return data
}


export default async function DynamicRoute({ params, }: { params: { id: string } }){
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const data = await getData({ userId: user?.id as string, noteId: params.id})

    async function postData(formData: FormData) {
        "use server"

        const title = formData.get("title") as string
        const description = formData.get("description") as string

        await prisma.note.update({
            where: {
                id: data?.id,
                userId: user?.id
            },
            data: {
                description: description,
                title: title
            }
        })
        revalidatePath('/dashboard')
        return redirect('/dashboard')
    }
    return(
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle>New Node</CardTitle>
                    <CardDescription>
                        Right Here you can now edit your new notes
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <div className="gap-y-2 flex flex-col">
                        <Label>Title</Label>
                        <Input
                            required
                            type="text"
                            name="title"
                            placeholder="Title for your note"
                            defaultValue={data?.title}
                        />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" placeholder="Describe your note as you want" required />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button asChild variant="destructive">
                        <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    )
}