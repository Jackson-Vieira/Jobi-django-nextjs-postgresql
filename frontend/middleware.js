import {NextResponse} from 'next/server';

const allowedParams= [
    "keyword",
    "location",
    "jobType",
    "education",
    "experience",
    "max_salary",
    "min_salary",
];

export async function middleware(req) {
    const url = req.nextUrl; 
    let changed = false;

    console.log(url)
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
    matcher: ['/'],
  }