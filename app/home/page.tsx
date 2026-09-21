"use client";

import HeaderBackground, { set_mouse_position } from "./components/HeaderBackground";
import "./local.css";
import RandomFeature from "../util/featured_images";

export default function Home() {
    return (
        <div>
            <div onMouseMove={set_mouse_position} className="main-header-div">
                <RandomFeature id="header-images"/>
                <HeaderBackground id="header-background" classes="w-full h-full"/>
            </div>

            
            
        </div>
    )
}