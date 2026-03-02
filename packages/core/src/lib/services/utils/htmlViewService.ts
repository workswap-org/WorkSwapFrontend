export const autoGrow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    console.log(getComputedStyle(el).lineHeight)
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
};

