import { ReactNode } from "react"

const RootLayout=({children}:{children: ReactNode})=>{
    return (
        <main>
            navbar
            {children}
            foot
        </main>
    )
}
export default RootLayout