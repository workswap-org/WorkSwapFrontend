const Avatar = ({ user, size = 40, className = "", link = true}) => {
    if (!user) return null;

    const handleClick = () => {
        if (link) window.location.href = `/profile/${user.id}`;
    };

    return (
        <img
            className={`${className} avatar p${size}-avatar`}
            src={user.avatarUrl || "/images/avatar-placeholder.png"}
            alt="Аватар"
            style={{ cursor: "pointer" }}
            onClick={handleClick}
            onError={(e) => { e.currentTarget.src = "/images/avatar-placeholder.png"; }}
        />
    );
};

export default Avatar;