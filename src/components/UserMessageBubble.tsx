interface UserMessageBubbleProps {
    text: string;
}

export const UserMessageBubble = ({ text }: UserMessageBubbleProps) => {
    return (
        <div className="flex w-full justify-end mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="max-w-[90%] md:max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-5 py-3 text-primary-foreground shadow-sm">
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{text}</p>
            </div>
        </div>
    );
};
