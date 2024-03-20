import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../../components/ui/button";
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function Navbar() {
  const { isAuthenticated } = getKindeServerSession()
  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
        <div className="container flex items-center justify-between">
          <Link href="/">
            <h1 className="font-bold text-3xl">Noteworthy</h1>
          </Link>
          <div className="flex items-center gap-x-5">
            <ThemeToggle /> 
            { await isAuthenticated() ? 
              (
                <LogoutLink>
                  <Button>Log out</Button>
                </LogoutLink>
              ) : (
              <div className="flex items-center gap-x-5">
                <LoginLink>
                  <Button>Sign in</Button>
                </LoginLink>
                <RegisterLink>
                  <Button variant="secondary">Sign Up</Button>
                </RegisterLink>
              </div>
              )
            }
          </div>
        </div>
    </nav>
  )
}
