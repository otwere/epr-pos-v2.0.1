import React, { useState, useEffect } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";

const CalltoAction = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        showButton && (
            <button
                onClick={scrollToTop}
                className="fixed h-11 bottom-3 right-2 p-3 rounded-md bg-blue-500 text-white  hover:bg-blue-700 transition duration-300">            
                <ArrowUpOutlined className="text-sm" />
            </button>
        )
    );
};

export default CalltoAction;
