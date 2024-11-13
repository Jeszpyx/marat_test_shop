type UserModel = {
    id: string
    tg_id: number
    role: 'admin' | 'user',
    first_name: string,
    last_name: string | null,
    username: string | null,
    phone_number: string | null,
    created_at: Date
}