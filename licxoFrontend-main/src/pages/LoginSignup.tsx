import React from "react";
import {Tabs, Tab, Input, Link, Button, Card, CardBody} from "@heroui/react";
import DefaultLayout from "@/layouts/default";

export default function App(): React.JSX.Element {
  const [selected, setSelected] = React.useState<React.Key>("login");

  return (
    // Changes: 'justify-center' hataya aur 'pt-24' add kiya taaki form upar shift ho jaye
    <DefaultLayout>
 <div className="flex flex-col w-full min-h-screen items-center pt-24 bg-background text-foreground">
      <Card className="max-w-full w-[340px] h-auto">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            aria-label="Tabs form"
            selectedKey={selected}
            size="md"
            onSelectionChange={setSelected}
          >
            <Tab key="login" title="Login">
              <form className="flex flex-col gap-4">
                {/* Login only with Phone Number */}
                <Input 
                  isRequired 
                  label="Phone Number" 
                  placeholder="Enter your phone number" 
                  type="tel" 
                />
                
                <p className="text-center text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sign-up")}>
                    Sign up
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary">
                    Login / Get OTP
                  </Button>
                </div>
              </form>
            </Tab>
            
            <Tab key="sign-up" title="Sign up">
              <form className="flex flex-col gap-4">
                <Input 
                  isRequired 
                  label="Username" 
                  placeholder="Enter your username" 
                  type="text" 
                />
                <Input 
                  isRequired 
                  label="Email" 
                  placeholder="Enter your email" 
                  type="email" 
                />
                <Input 
                  isRequired 
                  label="Phone Number" 
                  placeholder="Enter your phone number" 
                  type="tel" 
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Create a password"
                  type="password"
                />
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("login")}>
                    Login
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary">
                    Sign up
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
    </DefaultLayout>
   
  );
}