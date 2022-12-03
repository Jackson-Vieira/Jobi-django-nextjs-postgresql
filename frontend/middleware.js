import {NextResponse} from 'next/server';

const allowedParams= [
    "keyword",
    "location",
    "jobType",
    "education",
    "experience",
    "salary",
];

export async function middleware(req) {
    const url = req.nextUrl; 
    let changed = false;

    url.searchParams.forEach((element, key) => {
        if(!allowedParams.includes(key)) {
            url.searchParams.delete(key);
            changed=true;
        }
    });
    
    if(changed) {
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/'], // BUG, FIX WITH REGEX?
}