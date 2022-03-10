import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGithub,
    faLinkedin,
    faFacebook,
    faTwitter,
    faInstagram,
    faDiscord
} from "@fortawesome/free-brands-svg-icons";
import {css} from "@emotion/css";


export default function Social() {
    return (
        <div>
            <a href="https://github.com/philspins" className={icon}>
                <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
            <a href="https://www.linkedin.com/in/philipjohnbasil/" className={icon}>
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a href="https://www.facebook.com/philip.craig.79" className={icon}>
                <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="https://www.twitter.com/philviral" className={icon}>
                <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a href="https://www.instagram.com/accordianthief" className={icon}>
                <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="https://discordapp.com/users/philphilphil#7012/" className={icon}>
                <FontAwesomeIcon icon={faDiscord} size="2x" />
            </a>
        </div>
    );
}

const icon = css`
  color: rgba(30, 30, 30, .7);
 margin-right: 10px;
`