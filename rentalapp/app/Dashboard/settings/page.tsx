import { UserProfile } from "@clerk/nextjs";
import DashboardLayout from "../DashboardLayout";

export default function Settings(){
    return(
        <DashboardLayout
        currentPage="setting"
        headerTitle="Settings"
        headerSubtitle="update your account"
        >
        <div className="">
            <UserProfile routing="hash"/>
        </div>
        </DashboardLayout>
    )
}