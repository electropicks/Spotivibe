import React, { useEffect } from "react";
import Router from 'next/router'

export default () => {
    useEffect(() => {
        const {pathname} = Router
        if (pathname == '/') {
            Router.push('/home')
        }
    });
}