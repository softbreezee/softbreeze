import React from "react";
import Hamburger from "./Hamburger";

const Header = () => {

    return (<header>
        <nav>
            <Hamburger />
            <div class="nav-links">
                {/* <span style={{
                fontStyle: "italic",
                fontFamily: "monospace",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "purple"
            }}>SOFT BREEZEE</span> */}

                <a href="/">首页</a>
                <a href="/about/">关于</a>
                <a href="/blog/">博客</a>
            </div>
        </nav>
    </header>
    )
}


export default Header;