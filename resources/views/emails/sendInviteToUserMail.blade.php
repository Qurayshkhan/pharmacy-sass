<x-mail::message>
# You’re Invited to Join {{ config('app.name') }}

Hello {{ $user->name ?? 'there' }},

You have been invited to join **{{ config('app.name') }}**.
By accepting this invitation, you’ll be able to access your account and start using the platform right away.

<x-mail::button :url="$inviteUrl">
Accept Invitation
</x-mail::button>

If you were not expecting this invitation, you can safely ignore this email.

Thanks,<br>
{{ config('app.name') }} Team
</x-mail::message>
