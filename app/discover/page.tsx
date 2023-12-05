import Button from "@mui/joy/Button";
import {Typography} from "@mui/joy";
import Grid from '@mui/material/Grid';
//import React, {useState} from "react";
import Box from '@mui/material/Box';
import Header from "./header";
import Categories from "./Categories"
import "./discover.css"
import {redirect} from "next/navigation";
import Stack from "@mui/joy/Stack";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";



export default async function Discover() {

    const supabase = createServerComponentClient<Database>({cookies});
    const {data: {session}} = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }
    return (
        <Categories></Categories>
    )
}