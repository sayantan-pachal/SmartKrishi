export default function SmartKrishiLogo({ size = 10 }) {
    return (
        <span className="inline-flex items-center gap-1 align-middle">
            <img
                src="/circular_logo.png"
                alt="SmartKrishi Logo"
                className={`w-${size} h-${size} rounded-full`}
            />
            <img
                src="/logo.png"
                alt="SmartKrishi Text Logo"
                className={`h-${size} object-contain`}
            />
        </span>
    );
}