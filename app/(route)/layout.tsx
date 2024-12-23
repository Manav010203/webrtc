import { ReactNode } from "react"

const RootLayout=({children}:{children: ReactNode})=>{
    return (
        <main>
        
            {children}
            foot
        </main>
    )
}
export default RootLayout