// ==UserScript==
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

(function() {
    'use strict';

    //// Config
    const p_color_visited = "LightCoral";
    const p_except = "mail.live.com,";
    const style_id_prefix = "visited-links-styler-";

    //// Logic
    const css_template = `a:visited, a:visited * { color: ${p_color_visited} !important; }`;

    function isExceptSite(except, site) {
        const exceptList = except.split(",").filter(Boolean);
        return exceptList.some(domain => site.includes(domain.trim()));
    }

    function applyStyles(rootNode) {
        try {
            const style = document.createElement('style');
            style.id = style_id_prefix + (rootNode === document ? 'main' : 'shadow-' + Math.random().toString(36).substr(2, 9));
            style.textContent = css_template;
            
            if (rootNode.head) { // For main document
                rootNode.head.appendChild(style);
            } else { // For Shadow DOM
                rootNode.appendChild(style);
            }
        } catch (e) {
            console.error('Failed to apply styles:', e);
        }
    }

    function traverseAndApply(node) {
        // Apply to the node itself if it's a shadow root
        if (node.shadowRoot) {
            applyStyles(node.shadowRoot);
        }

        // Traverse children
        const allChildren = node.querySelectorAll('*');
        allChildren.forEach(child => {
            if (child.shadowRoot) {
                applyStyles(child.shadowRoot);
            }
        });
    }

    function main() {
        if (isExceptSite(p_except, window.location.hostname)) {
            return;
        }

        const run = () => {
            // Apply to main document
            applyStyles(document);

            if (!document.body) {
                // If body doesn't exist yet, wait for it.
                new MutationObserver((_, obs) => {
                    if (document.body) {
                        obs.disconnect();
                        traverseAndApply(document.body);
                        observeBody();
                    }
                }).observe(document.documentElement, { childList: true });
            } else {
                // If body exists, proceed.
                traverseAndApply(document.body);
                observeBody();
            }
        };

        const observeBody = () => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            traverseAndApply(node);
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        };

        run();

        // Add focus listener to force repaint for visited links in other tabs
        window.addEventListener('focus', () => {
            if (document.body) {
                // This is a common trick to force a browser repaint.
                document.body.style.opacity = '0.9999';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 0);
            }
        });
    }

    // Since @run-at is document-start, we need to wait for the DOM to be ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();

// End
