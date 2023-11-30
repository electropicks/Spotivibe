import * as React from 'react';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Person from '@mui/icons-material/Person';


const NavBar: React.FC = () => {
    return (
    <Box component="nav" aria-label="My site" sx={{ flexGrow: 1 }}>
    <List role="menubar" orientation="horizontal">
        <ListItem role="none">
            <ListItemButton role="menuitem" component="a" href={'/home'}>
                SPOTIVIBE
            </ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem role="none">
            <ListItemButton role="menuitem" component="a" href={'/discover'}>
                Discover
            </ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem role="none">
            <ListItemButton role="menuitem" component="a" href="#horizontal-list">
                Search
            </ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem role="none">
            <ListItemButton role="menuitem" component="a" href="#horizontal-list">
                Blended
            </ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem role="none">
            <ListItemButton role="menuitem" component="a" href="#horizontal-list">
                Feedback
            </ListItemButton>
        </ListItem>
        <ListItem role="none" sx={{ marginInlineStart: 'auto' }}>       
        <ListItemButton
                role="menuitem"
                component="a"
                href={'/auth/signout'}
                aria-label="Profile"
            >
                <Person />
            </ListItemButton>
        </ListItem>
    </List>
    </Box>
    )
}

export default NavBar