import React from 'react'

function Edgecase() {
    return (
        <div className="pt-28 px-4 pb-24 dark:bg-black h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Not Found</h1>
            <h4 className="text-4xl mt-2 font-bold text-center text-gray-900 dark:text-white">Something went wrong !</h4>
            <p className="text-lg max-w-3xl mt-4 mx-auto text-center text-gray-600 dark:text-gray-400">
                The page you are looking for does not exist or an unexpected error has occurred.
            </p>
            <p className="text-lg max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-400">
                Please check the URL or return to the homepage.
            </p>
        </div>
    )
}

export default Edgecase