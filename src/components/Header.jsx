import React from "react";
import Hamburger from "./Hamburger";

const Header = () => {

    return (<header>
        <nav class="main-nav">
            <Hamburger />
            <div class="nav-links">
                {/* <span style={{
                fontStyle: "italic",
                fontFamily: "monospace",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "purple"
            }}>SOFT BREEZEE</span> */}

                <a class="nav-link" href="/">首页</a>
                <a class="nav-link" href="/about/">关于</a>
                <a class="nav-link" href="/blog/">博客</a>
                <a class="nav-link" href="/tags">标签</a>
            </div>
        </nav>
    </header>
    )
}


export default Header;