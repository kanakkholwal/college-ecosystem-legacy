import { NextRequest, NextResponse } from "next/server";
import { getUsers } from 'src/lib/users/actions';

export async function GET(request: NextRequest) {
    try{
        const url = new URL(request.url);

        const query = url.searchParams.get('query') || '';
        const offset = Number(url.searchParams.get('offset')) || 1;

        const { users, hasMore } = await getUsers(query, offset, {});

        return NextResponse.json({
            users,
            hasMore
        },{
            status: 200
        })

    }catch{
        return NextResponse.json({
            success: false,
            message: "An error occurred"
        },{
            status: 500
        })
    }

}