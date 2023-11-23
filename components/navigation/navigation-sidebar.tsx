import { NavigationAction } from "./navigation-action";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

const NavigationSideBar = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const severs = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
            <NavigationAction />
        </div>
    );
};

export default NavigationSideBar;
