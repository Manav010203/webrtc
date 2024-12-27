import StreamVideoProvider from "@/providers/StreamClientProvider"
import { Metadata } from "next";
import { ReactNode } from "react"
export const metadata: Metadata = {
  title: "webrtc",
  description: "meeting experience in video",
  icons:{
    icon: '/icons/logo.svg'
  }
};
const RootLayout=({children}:{children: ReactNode})=>{
    return (
        <main>
          <StreamVideoProvider>
          {children}
          </StreamVideoProvider>
        </main>
    )
}
export default RootLayout