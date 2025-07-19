﻿// ==UserScript==
// @name        Visited Links Colorizer (Final v2.6 - Icon Support)
// @namespace   Cascade.VisitedLinks.Final
// @description Injects a direct CSS rule into all Shadow DOMs to color visited links, including text and SVG icons.
// @version     2.6
// @author      Cascade
// @match       http*://*/*
// @exclude     https://mail.live.com/*
// @grant       none
// @run-at      document-start
// ==/UserScript==

(function ()
{

//// Config

// View your old config from Visited
// about:config?filter=extensions.visited

// Copy from extensions.visited.color.visited
var p_color_visited = "LightCoral";

// Copy from extensions.visited.except
var p_except = "mail.live.com,";

//// End Config

//// Variable

const style_id = "visited-lite-7e-style";
const css_a_visited = " a:visited, a:visited * { color: %COLOR% !important; } ";

var colorArr = ["Aqua","Blue","BlueViolet","Brown","CadetBlue","Chocolate","Coral"
    ,"CornflowerBlue","Crimson","DarkGoldenRod","DarkGreen","DarkKhaki","DarkMagenta"
    ,"Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkTurquoise"
    ,"DarkViolet","DeepPink","DeepSkyBlue","DodgerBlue","FireBrick","ForestGreen"
    ,"Fuchsia","Gold","GoldenRod","Green","GreenYellow","HotPink","IndianRed"
    ,"Indigo","Khaki","Lavender","LawnGreen","LightCoral","LightSalmon","LightSeaGreen"
    ,"LightSteelBlue","Lime","LimeGreen","Magenta","Maroon"
	,"MediumAquaMarine","MediumOrchid","MediumSlateBlue","MediumTurquoise","NavajoWhite","Navy"
	,"Orange","OrangeRed","Orchid","PaleVioletRed","Peru","Purple","Red","RosyBrown"
	,"RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","Sienna","SlateBlue"
	,"SpringGreen","SteelBlue","Tomato","Turquoise","Violet","YellowGreen"];

//// End Variable

//// Function

function attachOnLoad(callback)
{
	window.addEventListener("load", function (e)
	{
		callback();
	});
}

function attachOnReady(callback)
{
	document.addEventListener("DOMContentLoaded", function (e)
	{
		callback();
	});
}

function isExceptSite(except, site)
{
    var exceptList = except.split(",");
    for (var i = 0; i < exceptList.length; i++)
    {
        var str = exceptList[i].replace(/\s/ig,"");

        var str1 = str;
        if (str1.indexOf(".") != 0 && str1.indexOf("/") != 0)
            str1 = "." + str1;

        var str2 = str;
        if (str2.indexOf("://") != 0)
            str2 = "://" + str2;

        if(str != ""
            && (site.indexOf(str1) > -1 || site.indexOf(str2) > -1))
        {
            return true;
        }
    }
    return false;
}

function addStyle(css)
{
    var style = document.getElementById(style_id);
    if(style == null)
    {
        var heads = document.getElementsByTagName("head");

        if(heads != null && heads.length > 0)
        {
            var head = heads[0];
            var style = document.createElement("style");
            if(style != null)
            {
                style.setAttribute("id",style_id);
                style.setAttribute("type","text/css");
                head.appendChild(style);
            }
        }
    }

    if(style != null)
    {
        style.textContent = String(css);
    }
}

function assignColor(css, color)
{
    return css.replace(/%COLOR%/ig, color);
}

function main()
{
	var url = document.documentURI;
	var css = "";

	css += assignColor(css_a_visited, p_color_visited);

	if(!isExceptSite(p_except, url))
	{
		addStyle(css);
	}
}

//// End Function

attachOnReady(main);

})();

// End