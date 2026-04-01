export default function SmartKrishiLogo() {
    return (
        <div className="flex items-center gap-2">
            <svg
                width="36"
                height="36"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-green-600"
            >
                {/* Outer circle */}
                <circle
                    cx="32"
                    cy="32"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="4"
                />

                {/* Leaf */}
                <path
                    d="M32 14C22 22 20 36 32 46C44 36 42 22 32 14Z"
                    fill="currentColor"
                />

                {/* Field lines */}
                <path
                    d="M20 38C26 40 38 40 44 38"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M22 42C28 44 36 44 42 42"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>

            <span className="text-xl font-semibold text-gray-800 dark:text-white">
                SmartKrishi
            </span>
        </div>
    );
}