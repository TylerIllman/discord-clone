"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2, Video } from "lucide-react";
import { error } from "console";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        let name = "";

        if (user?.username) {
            name = user.username;
        } else {
            if (!user?.firstName || !user?.lastName) {
                return;
            }
            name = `${user.firstName} ${user.lastName}`;
        }

        (async () => {
            try {
                const resp = await fetch(
                    `/api/get-participant-token?room=${chatId}&username=${name}`
                );

                const data = await resp.json();
                setToken(data.token);
                console.log("data: ", data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [user?.firstName, user?.lastName, user?.username, chatId]);

    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <VideoConference />
        </LiveKitRoom>
    );
};
