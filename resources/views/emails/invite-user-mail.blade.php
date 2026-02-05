@extends('emails.email-layout')

@section('content')
    <h2>Hello {{ $user->name }},</h2>

    <p>
        You have been invited to join <strong>{{ config('app.name') }}</strong>.
        Click the button below to accept your invitation.
    </p>

    <a href="{{ $inviteUrl }}" class="btn">
        Accept Invitation
    </a>

    <p style="margin-top: 30px;">
        If you didn’t request this, you can safely ignore this email.
    </p>
@endsection
