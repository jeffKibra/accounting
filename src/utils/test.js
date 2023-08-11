From 1773664405479613283@xxx Tue Aug 08 12:36:29 +0000 2023
X-GM-THRID: 1773664405479613283
X-Gmail-Labels: Inbox,Category updates,Unread
Delivered-To: royalescrap@gmail.com
Received: by 2002:ab4:1806:0:b0:37d:9905:cf38 with SMTP id p6csp1730711vll;
        Tue, 8 Aug 2023 05:36:29 -0700 (PDT)
X-Received: by 2002:a05:6808:b33:b0:3a7:5c52:5e88 with SMTP id t19-20020a0568080b3300b003a75c525e88mr10394923oij.16.1691498189332;
        Tue, 08 Aug 2023 05:36:29 -0700 (PDT)
ARC-Seal: i=1; a=rsa-sha256; t=1691498189; cv=none;
        d=google.com; s=arc-20160816;
        b=FFhW4xZs5muHYe8o/rvCH8OuMtPVz/DQKc1Zdvlruh+QTTDD5IW0hqymLudP7YHN9e
         Mrwnk+oJ1v5/jgk0EHs3SA9xi6ygNinYbJyf+f4e90Re3Eo6s17+UNvr05PceT8D0vR1
         OkY0y20FAXroq4vhFOTpPd5DiPPOCuxEMsUEad01gx16+ETGDxljBce72bYXctO+jBcW
         90XfoWraE8ACles6JRT+B9fJv1u9Qg38tx1N3mB8rB//BRYNNKkbxUqGmMoI+OIgf8am
         A+qsE442E7oPEVrv0zZ1agoxR42oSr4GXu7wl56OrO3oT96Jh7ov/A0MtlNBfflA6aLE
         1dzg==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816;
        h=to:from:subject:message-id:feedback-id:date:mime-version
         :dkim-signature;
        bh=Jl2lx79lo9XDOGEQ6XtAJzKDg4/KOrTLwSirMmZQKHQ=;
        fh=v7l5X0VUT9mbfVdWlrD/i8Bxbug21qDmmwLhqyHZnFI=;
        b=PHbiDGkC+nlWPzGdT1ZLWWAjLlY3OMzjnha6WbSSAHV0p0pzGCkmWtWKEIbDxKuxoD
         KXl1GOQoRW3wK+I8M+gzJVutPxXLyjYKsa/IGU8SGF9zw8y1H/rQKT+9/mpHskp3iC0Q
         AQkOPUvYuVj0fdeJgg2XGlG6L21vbrYg2J1nCw1TwRaXEek5yktnTZSN+HMkYIjPZ5qG
         GCFIjillNuk5UQh8cneXABPfxbyi4x0pVUNdNakNpvgVWkvm4+A6XRCznVs/IRUrJF3u
         +6E5XBDGDO3ORt0R0E2nhPB2sSDp52PaYgOng3aw2zXvoU6al5XfaLqSdsX4BS9dlA27
         qNqA==
ARC-Authentication-Results: i=1; mx.google.com;
       dkim=pass header.i=@accounts.google.com header.s=20221208 header.b=pw2vItq6;
       spf=pass (google.com: domain of 3ztbszagtc7ade-hufboqssekdji.weewbu.secheoqbuishqfwcqyb.sec@gaia.bounces.google.com designates 209.85.220.73 as permitted sender) smtp.mailfrom=3zTbSZAgTC7Ade-hUfboQSSekdji.WeeWbU.SecheoQbUiShQfWcQYb.Sec@gaia.bounces.google.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=accounts.google.com
Return-Path: <3zTbSZAgTC7Ade-hUfboQSSekdji.WeeWbU.SecheoQbUiShQfWcQYb.Sec@gaia.bounces.google.com>
Received: from mail-sor-f73.google.com (mail-sor-f73.google.com. [209.85.220.73])
        by mx.google.com with SMTPS id j15-20020a056808034f00b003a41e37815csor13434182oie.5.2023.08.08.05.36.29
        for <royalescrap@gmail.com>
        (Google Transport Security);
        Tue, 08 Aug 2023 05:36:29 -0700 (PDT)
Received-SPF: pass (google.com: domain of 3ztbszagtc7ade-hufboqssekdji.weewbu.secheoqbuishqfwcqyb.sec@gaia.bounces.google.com designates 209.85.220.73 as permitted sender) client-ip=209.85.220.73;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@accounts.google.com header.s=20221208 header.b=pw2vItq6;
       spf=pass (google.com: domain of 3ztbszagtc7ade-hufboqssekdji.weewbu.secheoqbuishqfwcqyb.sec@gaia.bounces.google.com designates 209.85.220.73 as permitted sender) smtp.mailfrom=3zTbSZAgTC7Ade-hUfboQSSekdji.WeeWbU.SecheoQbUiShQfWcQYb.Sec@gaia.bounces.google.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=accounts.google.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=accounts.google.com; s=20221208; t=1691498189; x=1692102989;
        h=to:from:subject:message-id:feedback-id:date:mime-version:from:to:cc
         :subject:date:message-id:reply-to;
        bh=Jl2lx79lo9XDOGEQ6XtAJzKDg4/KOrTLwSirMmZQKHQ=;
        b=pw2vItq6pxrA87f2RFCA+8KKl8MjiOgSmI0Cuwwgsm+otp/8cleBSWjMwdzs7Dc/7y
         QcnHqisJgS07y56a8xovfkW5bI5V8YgJqNOUC/GsjX5/i7Ydt0ol+k+YH61DPMulTkns
         gxExJ5Keo2FtJ+HFgP3A2NvnWkZydZ8jpygOVhBL0NPUFtZs0PeFI6loCoHDzZKgbJwD
         DyO7WVP+MhZs9uDj6jz3rin/ZMsP0Tjju1JtqXbL8I6jJIgUZZGgeXBJQpCHkGsm9js/
         9ob5Lulk2Gl7gySP9nbgT/VIJiMybc0E0+1zkDfsEo6wqlCbGEx2L7vmvUUBjUMQW6TK
         Mr1w==
X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=1e100.net; s=20221208; t=1691498189; x=1692102989;
        h=to:from:subject:message-id:feedback-id:date:mime-version
         :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to;
        bh=Jl2lx79lo9XDOGEQ6XtAJzKDg4/KOrTLwSirMmZQKHQ=;
        b=kgDW6daKDY8QJdKnorbMpHewVJ+5jxpEYoI5TlEpJ0Gx7SYf6QszKW+5o4xsnR5CvI
         fW6aQ4CDDUXYpiSkp5ZRnH+BLeHUbMqH9stMsT3zbt2vQzNwePCNi4UHgvLNepBxe2+F
         57GHQk1BOSHG7BAqSR5Cqx3pD4o6V07iaoWpnpfL+eZyui9xUfcUGNwqr+b4a/E85ES5
         9zLahvQgxxs0bTgDCfTwi2CNJwC0bjUJzPX/+W74xa66sH4D4CNMvDBL742Mo7Mmbjea
         5lhLCNCZh3eim6bIv0kXnr9zEuaiPOqS86zsQwvuH2z4mLkaTTTx8lvQ1dgMyHHmRPiq
         vkTg==
X-Gm-Message-State: AOJu0Yw52k+Ibim/2KzYclSkzXhh4BahHSY+7n89a/A5h07ygrwxsHxc
	P7Gy89ILc0685AJCK4Z+Wp0ITU0TKJhX6+w/ZhfcAdkL
X-Google-Smtp-Source: AGHT+IHMhowVl3YpgKG/2R0oztpcx6O+kProBf0jwGJB0s6TJ3ee13qGSnpzbo65SI+/Abpn03HSo5XIoHewHyQAhSV1nA==
MIME-Version: 1.0
X-Received: by 2002:a05:6808:1801:b0:3a7:3100:f8b8 with SMTP id
 bh1-20020a056808180100b003a73100f8b8mr22264111oib.9.1691498189167; Tue, 08
 Aug 2023 05:36:29 -0700 (PDT)
Date: Tue, 08 Aug 2023 12:36:28 GMT
X-Account-Notification-Type: 264
Feedback-ID: 264:account-notifier
X-Notifications: 64efa65a23e40000
X-Notifications-Bounce-Info: AYb2H10QIGAhGJGZKOJFS5r8mPtlYvvtDyVJoPWXmnj8m9wXn54JUwpdjhd31aX7W2mAgRUyxnxBk2vH_qaI2rpREhwhuGXAKNrPN7sO3f52jVPPUU3Wu5rXRXJeHqi7KX5DyRqATazQR6M7F7GvHW-gRDEZ3_6uvC9dx2LcSyzzOHeTesV9mEvEBTkMNbacn7nLTlZqlQNjAwNjA0MDQxNTM1NTk2OTMzMg
Message-ID: <GtIFKUvY97ErpzJ5j-JMxQ@notifications.google.com>
Subject: Your Google Account was recovered successfully
From: Google <no-reply@accounts.google.com>
To: royalescrap@gmail.com
Content-Type: multipart/alternative; boundary="000000000000b41b470602689c29"

--000000000000b41b470602689c29
Content-Type: text/plain; charset="UTF-8"; format=flowed; delsp=yes
Content-Transfer-Encoding: base64

W2ltYWdlOiBHb29nbGVdDQpBY2NvdW50IHJlY292ZXJlZCBzdWNjZXNzZnVsbHkNCg0KDQpyb3lh
bGVzY3JhcEBnbWFpbC5jb20NCldlbGNvbWUgYmFjayB0byB5b3VyIGFjY291bnRJZiB5b3Ugc3Vz
cGVjdCB5b3Ugd2VyZSBsb2NrZWQgb3V0IG9mIHlvdXINCmFjY291bnQgYmVjYXVzZSBvZiBjaGFu
Z2VzIG1hZGUgYnkgc29tZW9uZSBlbHNlLCB5b3Ugc2hvdWxkIHJldmlldyBhbmQNCnByb3RlY3Qg
eW91ciBhY2NvdW50Lg0KPGh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9BY2NvdW50Q2hvb3Nl
cj9FbWFpbD1yb3lhbGVzY3JhcEBnbWFpbC5jb20mY29udGludWU9aHR0cHM6Ly9teWFjY291bnQu
Z29vZ2xlLmNvbS9zZWN1cmUtYWNjb3VudD91dG1fc291cmNlJTNEZW1haWwlMjZ1dG1fbWVkaXVt
JTNEZW1haWwlMjZ1dG1fY2FtcGFpZ24lM0RwaCUyNnNyYyUzRDE0JTI2YW5laWQlM0Q3ODkxOTU1
NDg0MzIxNTg0NTQ2Pg0KWW91IHJlY2VpdmVkIHRoaXMgZW1haWwgdG8gbGV0IHlvdSBrbm93IGFi
b3V0IGltcG9ydGFudCBjaGFuZ2VzIHRvIHlvdXINCkdvb2dsZSBBY2NvdW50IGFuZCBzZXJ2aWNl
cy4NCsKpIDIwMjMgR29vZ2xlIExMQywgMTYwMCBBbXBoaXRoZWF0cmUgUGFya3dheSwgTW91bnRh
aW4gVmlldywgQ0EgOTQwNDMsIFVTQQ0K
--000000000000b41b470602689c29
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

<!DOCTYPE html><html lang=3D"en"><head><meta name=3D"format-detection" cont=
ent=3D"email=3Dno"/><meta name=3D"format-detection" content=3D"date=3Dno"/>=
<style nonce=3D"ri5lw005GyvxKwCxOPpxkw">.awl a {color: #FFFFFF; text-decora=
tion: none;} .abml a {color: #000000; font-family: Roboto-Medium,Helvetica,=
Arial,sans-serif; font-weight: bold; text-decoration: none;} .adgl a {color=
: rgba(0, 0, 0, 0.87); text-decoration: none;} .afal a {color: #b0b0b0; tex=
t-decoration: none;} @media screen and (min-width: 600px) {.v2sp {padding: =
6px 30px 0px;} .v2rsp {padding: 0px 10px;}} @media screen and (min-width: 6=
00px) {.mdv2rw {padding: 40px 40px;}} </style><link href=3D"//fonts.googlea=
pis.com/css?family=3DGoogle+Sans" rel=3D"stylesheet" type=3D"text/css" nonc=
e=3D"ri5lw005GyvxKwCxOPpxkw"/></head><body style=3D"margin: 0; padding: 0;"=
 bgcolor=3D"#FFFFFF"><table width=3D"100%" height=3D"100%" style=3D"min-wid=
th: 348px;" border=3D"0" cellspacing=3D"0" cellpadding=3D"0" lang=3D"en"><t=
r height=3D"32" style=3D"height: 32px;"><td></td></tr><tr align=3D"center">=
<td><div itemscope itemtype=3D"//schema.org/EmailMessage"><div itemprop=3D"=
action" itemscope itemtype=3D"//schema.org/ViewAction"><link itemprop=3D"ur=
l" href=3D"https://accounts.google.com/AccountChooser?Email=3Droyalescrap@g=
mail.com&amp;continue=3Dhttps://myaccount.google.com/secure-account?utm_sou=
rce%3Demail%26utm_medium%3Demail%26utm_campaign%3Dph%26src%3D14%26aneid%3D7=
891955484321584546"/><meta itemprop=3D"name" content=3D"Review Activity"/><=
/div></div><table border=3D"0" cellspacing=3D"0" cellpadding=3D"0" style=3D=
"padding-bottom: 20px; max-width: 516px; min-width: 220px;"><tr><td width=
=3D"8" style=3D"width: 8px;"></td><td><div style=3D"border-style: solid; bo=
rder-width: thin; border-color:#dadce0; border-radius: 8px; padding: 40px 2=
0px;" align=3D"center" class=3D"mdv2rw"><img src=3D"https://www.gstatic.com=
/images/branding/googlelogo/2x/googlelogo_color_74x24dp.png" width=3D"74" h=
eight=3D"24" aria-hidden=3D"true" style=3D"margin-bottom: 16px;" alt=3D"Goo=
gle"><div style=3D"font-family: &#39;Google Sans&#39;,Roboto,RobotoDraft,He=
lvetica,Arial,sans-serif;border-bottom: thin solid #dadce0; color: rgba(0,0=
,0,0.87); line-height: 32px; padding-bottom: 24px;text-align: center; word-=
break: break-word;"><div style=3D"font-size: 24px;">Account recovered succe=
ssfully </div><table align=3D"center" style=3D"margin-top:8px;"><tr style=
=3D"line-height: normal;"><td align=3D"right" style=3D"padding-right:8px;">=
<img width=3D"20" height=3D"20" style=3D"width: 20px; height: 20px; vertica=
l-align: sub; border-radius: 50%;;" src=3D"https://lh3.googleusercontent.co=
m/a/AAcHTtfDQEAVS7CJCqRIUfdOZlZdcxLqDGFAaXoxkaovTcOp=3Ds96-c" alt=3D""></td=
><td><a style=3D"font-family: &#39;Google Sans&#39;,Roboto,RobotoDraft,Helv=
etica,Arial,sans-serif;color: rgba(0,0,0,0.87); font-size: 14px; line-heigh=
t: 20px;">royalescrap@gmail.com</a></td></tr></table> </div><div style=3D"f=
ont-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 14px; col=
or: rgba(0,0,0,0.87); line-height: 20px;padding-top: 20px; text-align: left=
;"><h3>Welcome back to your account</h3>If you suspect you were locked out =
of your account because of changes made by someone else, you should <a href=
=3D"https://accounts.google.com/AccountChooser?Email=3Droyalescrap@gmail.co=
m&amp;continue=3Dhttps://myaccount.google.com/secure-account?utm_source%3De=
mail%26utm_medium%3Demail%26utm_campaign%3Dph%26src%3D14%26aneid%3D78919554=
84321584546" style=3D"text-decoration: none; color: #4285F4;" target=3D"_bl=
ank">review and protect your account.</a></div></div><div style=3D"text-ali=
gn: left;"><div style=3D"font-family: Roboto-Regular,Helvetica,Arial,sans-s=
erif;color: rgba(0,0,0,0.54); font-size: 11px; line-height: 18px; padding-t=
op: 12px; text-align: center;"><div>You received this email to let you know=
 about important changes to your Google Account and services.</div><div sty=
le=3D"direction: ltr;">&copy; 2023 Google LLC, <a class=3D"afal" style=3D"f=
ont-family: Roboto-Regular,Helvetica,Arial,sans-serif;color: rgba(0,0,0,0.5=
4); font-size: 11px; line-height: 18px; padding-top: 12px; text-align: cent=
er;">1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</a></div></div=
></div></td><td width=3D"8" style=3D"width: 8px;"></td></tr></table></td></=
tr><tr height=3D"32" style=3D"height: 32px;"><td></td></tr></table></body><=
/html>
--000000000000b41b470602689c29--

From 1773664142827023060@xxx Tue Aug 08 12:32:18 +0000 2023
X-GM-THRID: 1773664142827023060
X-Gmail-Labels: Inbox,Important,Opened,Category updates
Delivered-To: royalescrap@gmail.com
Received: by 2002:ab4:1806:0:b0:37d:9905:cf38 with SMTP id p6csp1728739vll;
        Tue, 8 Aug 2023 05:32:19 -0700 (PDT)
X-Received: by 2002:aa7:d959:0:b0:523:3f4f:dcd4 with SMTP id l25-20020aa7d959000000b005233f4fdcd4mr4292267eds.16.1691497938963;
        Tue, 08 Aug 2023 05:32:18 -0700 (PDT)
ARC-Seal: i=1; a=rsa-sha256; t=1691497938; cv=none;
        d=google.com; s=arc-20160816;
        b=BGaFh5D+hdKMGjfY/GbypkeCeFn0iusckPn50AgkVWGzbB5tPAfZ0aGH67/FyMbM0F
         PAOZW3NP0RYEcYAQkqDX9nNNNnmZvO/8iRyDNI9m/PBjhRjzPj4ylEO+E23K2eKDHhaO
         2WjXsSsDipO8ujidCmy50CoonNYAV6EZepoZa5ehaVflgTd2/BTxpIbxIvlCBCU4nHmq
         Xy6oCwaGOrtrZLw6Kl3wyin5TQh7FiHPBE0j42so+4B8BzecD+nP8RQ1Ky4xIJAgxdnG
         ZMXheg+v4qDX8aug3AdcinYPlJBwEftIlivWiFVtwBXIrDxo8985p90fzPNUalKMgnIw
         RsZQ==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816;
        h=to:from:subject:date:message-id:mime-version:dkim-signature;
        bh=1mlxBK57ftYUxe5q1/QnKH/yUdFfnlWcxDRNSvT4Gk4=;
        fh=xWlh4vHt4ipuVKDQmQEgUdjeybCEanatiDx75ey9Uy0=;
        b=vlsn0ELrBRlTFAHuyZB/GWqQCOdoHSwETgnFPtpvEzrrOYELsUNY55HnW+RHMSH1pg
         zlTwa45UXp11cgsb5JyZ8CV0oSMQy0XOiafMQxoqiU+Pkv1lvZRrOaMS+5X7GRmNXt0U
         I1OUkrny06Zo8qdb1+dGIdjbxHvwztB7IvTIDwBykjog5aNdc5g68ZN2fDeNNC1nBjeF
         jelNz1kJE3Mkyp4K1chvARseky6hTD6N7vsLvb2P1pIp1KrJMWqmilFv9ujEWOgdt/PJ
         iIy6Eg3oLbbPr/bl0IW3vIlDzV0v1tgkmbw4fHDECQvRQC8Y5WItn+oXz5v7fsaNjzIN
         S25w==
ARC-Authentication-Results: i=1; mx.google.com;
       dkim=pass header.i=@google.com header.s=20221208 header.b=STIj5xST;
       spf=pass (google.com: domain of 30jxszackc7mghkxierzhhzex.vhfkhrtexlvktizftbe.vhf@takeout.bounces.google.com designates 209.85.220.69 as permitted sender) smtp.mailfrom=30jXSZAcKC7MghkXierZhhZeX.VhfkhrTeXlVkTiZfTbe.Vhf@takeout.bounces.google.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=google.com
Return-Path: <30jXSZAcKC7MghkXierZhhZeX.VhfkhrTeXlVkTiZfTbe.Vhf@takeout.bounces.google.com>
Received: from mail-sor-f69.google.com (mail-sor-f69.google.com. [209.85.220.69])
        by mx.google.com with SMTPS id q30-20020a50c35e000000b0052255c5de35sor3671601edb.3.2023.08.08.05.32.18
        for <royalescrap@gmail.com>
        (Google Transport Security);
        Tue, 08 Aug 2023 05:32:18 -0700 (PDT)
Received-SPF: pass (google.com: domain of 30jxszackc7mghkxierzhhzex.vhfkhrtexlvktizftbe.vhf@takeout.bounces.google.com designates 209.85.220.69 as permitted sender) client-ip=209.85.220.69;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@google.com header.s=20221208 header.b=STIj5xST;
       spf=pass (google.com: domain of 30jxszackc7mghkxierzhhzex.vhfkhrtexlvktizftbe.vhf@takeout.bounces.google.com designates 209.85.220.69 as permitted sender) smtp.mailfrom=30jXSZAcKC7MghkXierZhhZeX.VhfkhrTeXlVkTiZfTbe.Vhf@takeout.bounces.google.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=google.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=google.com; s=20221208; t=1691497938; x=1692102738;
        h=to:from:subject:date:message-id:mime-version:from:to:cc:subject
         :date:message-id:reply-to;
        bh=1mlxBK57ftYUxe5q1/QnKH/yUdFfnlWcxDRNSvT4Gk4=;
        b=STIj5xSToU8NE6VcgYwR+Bsal2g/DRJ8+Ol/As5K0rk6eM4RH86LKpixRxhKDHwztv
         FO+Ub+zmEsR9ukJLyMmffAceKgn6wnqekWTOXGJzam6uh5EN36Qp5pbe4GDIM77nNnjG
         hxG+bwPW3kwjNCRIWXCP0ZRAYg3FnjsCYHlKFASvZyS/Em7b4ufeLtvwDU8pi3xltSpg
         6a7OG/4ChDUaMcM4KCnCJf/KXjy0/LhDfhe4/pJ2UddnaYRfpd7iGHc8g8iB7YgVIDVg
         +nY6BDQngr1a/QTrvAd+DcEMkSR+5IrYvhaMS0scdCg+oBtVzbKdlEfDlrWITbWFoc51
         vi6Q==
X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=1e100.net; s=20221208; t=1691497938; x=1692102738;
        h=to:from:subject:date:message-id:mime-version:x-gm-message-state
         :from:to:cc:subject:date:message-id:reply-to;
        bh=1mlxBK57ftYUxe5q1/QnKH/yUdFfnlWcxDRNSvT4Gk4=;
        b=ixqs/y9i65R8QHsQBCCPAn5ktfDxsfyrp3fRSq7TVOPpv6UuDgkKmp9SC5Nb2KSSVY
         PBXhjjQWgvbbcyencZ07u69ODSLpXI3epwSm/l6XfCnndcV+rY6rSVCrdnh4P52Fcll5
         Z8V1PhaPIsWY6IJwOq6dRp2jPbaiT6kQpK0S23j5ZZZQHVxH6+6ScW9Maz9jiMONPh+g
         JpNiEf/12xA6DRP2EBPhxVhwWCzwuHkjLfBjyRsUJHK9gi/NESzsXN8AtepLtRlaMB6z
         28dyJZ9m2tln3kud0vPfoK4X7HeCrskKMGBEuswhmJAhATEZ+6WzyHMVHufWRHOIxoUW
         cPWA==
X-Gm-Message-State: AOJu0YzhtU7q86jCNmu6ABHqzaLf/gaPlbZYurM95kdHDIbxC6zFVkRI
	JvkA8H7++2wC3DLHqipErbTJGpCff1V0sHsw2QuGpI4GMPFLm9DmEMWq/KMZNisIGe11ePILv3n
	ZP9Y7M/2SNRzyljEqN0W/x5fgq/2r8FcsvHyhVVCfhP9n
X-Google-Smtp-Source: AGHT+IEUcVZ6xXyOpTGHLGD2ADo6cKJWoyFdB9JB99XG7E/gxDfOA2ZaY/Fzu8zRbrt4RvI5sMWNibiqVfEibUcbxfsqyQ0vmWW99lk=
MIME-Version: 1.0
X-Received: by 2002:a50:d088:0:b0:522:1ede:c2e3 with SMTP id
 v8-20020a50d088000000b005221edec2e3mr63716edd.2.1691497938653; Tue, 08 Aug
 2023 05:32:18 -0700 (PDT)
Message-ID: <000000000000c5df0a0602688dff@google.com>
Date: Tue, 08 Aug 2023 12:32:18 +0000
Subject: Your Google data is ready to download
From: Google Takeout <noreply@google.com>
To: royalescrap@gmail.com
Content-Type: multipart/alternative; boundary="000000000000c5defd0602688dfc"

--000000000000c5defd0602688dfc
Content-Type: text/plain; charset="UTF-8"; format=flowed; delsp=yes

Your account, your data.
We&#39;ve finished creating a copy of the Google data that you requested on  
8 August 2023. You can download your files until 15 August 2023.
Your download will contain data from:
Mail
Google Finance
Contacts
Drive
Manage exports  
(https://accounts.google.com/AccountChooser?continue=https://takeout.google.com/manage&amp;Email=arlaadi.engineeringltd@gmail.com)
Download your files  
(https://accounts.google.com/AccountChooser?continue=https://takeout.google.com/settings/takeout/download?j%3D608e94fc-fac2-49f9-9c2d-d2429c8684ba%26i%3D0&amp;Email=arlaadi.engineeringltd@gmail.com)
This message was sent to you because you recently used Google Takeout.  
Learn more (https://support.google.com/accounts/answer/3024190) about how  
to locate, access and share your data.
  Privacy Policy (https://www.google.com/privacy/privacy-policy.html) |  
Terms of Service (https://www.google.com/accounts/TOS)


--000000000000c5defd0602688dfc
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

<div align=3D"center" style=3D"width:100%"><div align=3D"center" style=3D"b=
order-style:solid;border-width:thin;border-color:#dadce0; border-radius:8px=
;max-width:650px"><img src=3D"https://www.gstatic.com/images/branding/googl=
elogo/1x/googlelogo_color_74x24dp.png" width=3D"74" height=3D"24" aria-hidd=
en=3D"true" style=3D"margin-bottom:16px;margin-top:40px" class=3D"CToWUd" a=
lt=3D"Google logo"><div style=3D"font-family:Roboto-Regular,Helvetica,Arial=
,sans-serif;font-size:14px; color:rgba(0,0,0,0.87);line-height:20px;text-al=
ign:left;padding:0 20px;"><div><div align=3D"center" style=3D"font-size:24p=
x;font-family:'Google Sans',Roboto,RobotoDraft, Helvetica,Arial,sans-serif;=
border-bottom:thin solid #dadce0; color:rgba(0,0,0,0.87);line-height:32px;m=
argin-bottom:24px; padding-bottom:24px;text-align:center;word-break:break-w=
ord">Your account, your data.</div><div>We've finished creating a copy of t=
he Google data that you requested on 8 August 2023. You can download your f=
iles until 15 August 2023.</div><div style=3D"padding-top:15px">Your downlo=
ad will contain data from:</div><ul><li>Mail</li><li>Google Finance</li><li=
>Contacts</li><li>Drive</li></ul></div><div style=3D"text-align:center"><p>=
<a style=3D"background-color: #fff;; color: #000;; display: inline-block; p=
adding: 7px 15px; font-size: 15px; font-weight: bold; white-space: normal; =
border: solid 1px rgba(0, 0, 0, 0.14902); text-decoration: none; border-rad=
ius: 3px; font-family:&#39;Google Sans&#39;,Roboto,RobotoDraft,Helvetica,Ar=
ial,sans-serif; line-height:16px;color:#000;;font-weight:400;text-decoratio=
n:none;font-size:14px; display:inline-block;padding:10px 24px;background-co=
lor:#fff;;border-radius:5px; min-width:90px" href=3D"https://accounts.googl=
e.com/AccountChooser?continue=3Dhttps://takeout.google.com/manage&amp;Email=
=3Darlaadi.engineeringltd@gmail.com">Manage exports</a></p><p><a style=3D"b=
ackground-color: #4184f3;; color: #fff;; display: inline-block; padding: 7p=
x 15px; font-size: 15px; font-weight: bold; white-space: normal; border: so=
lid 1px rgba(0, 0, 0, 0.14902); text-decoration: none; border-radius: 3px; =
font-family:&#39;Google Sans&#39;,Roboto,RobotoDraft,Helvetica,Arial,sans-s=
erif; line-height:16px;color:#fff;;font-weight:400;text-decoration:none;fon=
t-size:14px; display:inline-block;padding:10px 24px;background-color:#4184f=
3;;border-radius:5px; min-width:90px" href=3D"https://accounts.google.com/A=
ccountChooser?continue=3Dhttps://takeout.google.com/settings/takeout/downlo=
ad?j%3D608e94fc-fac2-49f9-9c2d-d2429c8684ba%26i%3D0&amp;Email=3Darlaadi.eng=
ineeringltd@gmail.com">Download your files</a></p></div><div>This message w=
as sent to you because you recently used Google Takeout. <a style=3D"zSoyz"=
 href=3D"https://support.google.com/accounts/answer/3024190">Learn more</a>=
 about how to locate, access and share your data.</div></div><div style=3D"=
border-top: solid 1px #dfdfdf; color: #636363; font: 11px Arial; line-heigh=
t: 1.5em; border-bottom-left-radius:8px; border-bottom-right-radius:8px; pa=
dding: 10px 20px; background-color: #f5f5f5; height: 33px; text-align:left;=
"><div style=3D"width: 350px; display:inline-block; float: left;">&nbsp;<a =
style=3D"zSoyz" href=3D"https://www.google.com/privacy/privacy-policy.html"=
>Privacy Policy</a> | <a style=3D"zSoyz" href=3D"https://www.google.com/acc=
ounts/TOS">Terms of Service</a></div><div style=3D"border-style: none; widt=
h: 77px; height: 27px; display:inline-block; float: right;"><img src=3D"htt=
ps://gstatic.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png=
" style=3D"border-style: none; width: 74px; height: 24px; padding-top:5px;"=
 alt=3D"Google logo"/></div><br/></div></div></div>
--000000000000c5defd0602688dfc--

From 1773234526604208008@xxx Thu Aug 03 18:43:44 +0000 2023
X-GM-THRID: 1773234526604208008
X-Gmail-Labels: Inbox,Opened,Category updates
Delivered-To: royalescrap@gmail.com
Received: by 2002:ab4:1707:0:b0:379:9fb7:7f7d with SMTP id a7csp1039617vld;
        Thu, 3 Aug 2023 11:43:45 -0700 (PDT)
X-Received: by 2002:a9d:7cd1:0:b0:6b7:5777:f63e with SMTP id r17-20020a9d7cd1000000b006b75777f63emr15923176otn.9.1691088225222;
        Thu, 03 Aug 2023 11:43:45 -0700 (PDT)
ARC-Seal: i=1; a=rsa-sha256; t=1691088225; cv=none;
        d=google.com; s=arc-20160816;
        b=XWypfgaWYvP3/DQ/jks/4ZdRIxdbAIfsw1lDK5GIiEEnzkiU+ZUqoBoBrT8QcapJlO
         B0Un+3JDsvU2PbCPmjN3iveVoOVwruaoXFV4XudmQDixUt8DnelzfJ58kgukTmn7Z0+Q
         GAJ5sy/Fidc3kpLIP5T1rA+L6W7FcaJtuaHIZZ8R26ZCRN1+1u85vWbQgY/KF1QLOGn5
         bpVOdwdywKqJ6IPtN+wKjsD25oromnyVF4r1WT/8OkAfWwTaDT2CldLFbGDCLjdfcRMO
         YWf+KvfUHJTxN68Trxz7x6hbhjLPT84H4wicfA2nWaa/KyW+Lj0ZDVnOlxLxwF6Pq4/I
         FXRw==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816;
        h=to:from:subject:message-id:feedback-id:reply-to:date:mime-version
         :dkim-signature;
        bh=i64gZByl0aL/n86QsLVYFQT8GEDofGosCZrPStNsIaE=;
        fh=IkTxvn/URKhkrO2SHQZnK4uiEL6XWb7vktPvoB3RiFM=;
        b=w9+blC18GlbAabun2Sx9wqubZ1N+5/1O9jx6kag7spLl8N5LnNhl94LIQv2OSZ4J1l
         08s2qR70REWToa2TkA+RRZjKbUVkl55jrYDSso0x+BPW00ik6F6J1gd3aKDfNHPbvKRz
         R+fTq+IGs3dde5FuisJyjSQi8/M5rMx++vWaEsI7Sw/V+5AStJb7h223Kbin0cGApL7I
         zYSIRZrcU3BjN4eFOujodu3WcKN/VJvXgQ12m+i+1N91TB1LYJRjyU0QBJ6ap/7C7ry4
         nBEGJJjloBJ4W+Xif3UITdc1R2K7OnjG0XLujX2AiTjLHdNByHHHn4zd0ytsQX9ELUMt
         J4eA==
ARC-Authentication-Results: i=1; mx.google.com;
       dkim=pass header.i=@google.com header.s=20221208 header.b=PITdY3vq;
       spf=pass (google.com: domain of 3vvxlzbskaj0dlldib9ljjrkfqvqb7j-klobmivdlldib.9lj@scoutcamp.bounces.google.com designates 209.85.220.69 as permitted sender) smtp.mailfrom=3VvXLZBsKAJ0DLLDIB9LJJRKFQVQB7J-KLOBMIVDLLDIB.9LJ@scoutcamp.bounces.google.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=google.com
Return-Path: <3VvXLZBsKAJ0DLLDIB9LJJRKFQVQB7J-KLOBMIVDLLDIB.9LJ@scoutcamp.bounces.google.com>
Received: from mail-sor-f69.google.com (mail-sor-f69.google.com. [209.85.220.69])
        by mx.google.com with SMTPS id q13-20020a05683031ad00b006bc6cdec28bsor540294ots.14.2023.08.03.11.43.34
        for <royalescrap@gmail.com>
        (Google Transport Security);
        Thu, 03 Aug 2023 11:43:45 -0700 (PDT)
Received-SPF: pass (google.com: domain of 3vvxlzbskaj0dlldib9ljjrkfqvqb7j-klobmivdlldib.9lj@scoutcamp.bounces.google.com designates 209.85.220.69 as permitted sender) client-ip=209.85.220.69;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@google.com header.s=20221208 header.b=PITdY3vq;
       spf=pass (google.com: domain of 3vvxlzbskaj0dlldib9ljjrkfqvqb7j-klobmivdlldib.9lj@scoutcamp.bounces.google.com designates 209.85.220.69 as permitted sender) smtp.mailfrom=3VvXLZBsKAJ0DLLDIB9LJJRKFQVQB7J-KLOBMIVDLLDIB.9LJ@scoutcamp.bounces.google.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=google.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=google.com; s=20221208; t=1691088214; x=1691693014;
        h=to:from:subject:message-id:feedback-id:reply-to:date:mime-version
         :from:to:cc:subject:date:message-id:reply-to;
        bh=i64gZByl0aL/n86QsLVYFQT8GEDofGosCZrPStNsIaE=;
        b=PITdY3vqcJrFUSgDUZW2cdBMRwqZRKtvCp8bRsBjPBWRLjTn7VSm7QhcapY400N59H
         8/50D6EWqIyQ54Y3NSt7XZGdbIhEAgGxSii3vq0Lx/M5brncQyaX942RbUXn/2yduzIU
         q2DzeptgbCxOJOn9hIjJyT/y8Qo2RPJSL/6YpdWBjhH6oBPPVZDOsmOZ0ZW+98eR8PKz
         JIqjlu+ePQEoiL+47pPIky3UIJ0+1DtlE8xbNH8ksu888W32jISabOZof1FK6RBV83wv
         b0TXec/bf9mnS/oGBb5+O7uqnEMLg59MbUTfIXWdyZXaWdFpmIsu6uXvC6/2js4EXJHx
         WyjA==
X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=1e100.net; s=20221208; t=1691088214; x=1691693014;
        h=to:from:subject:message-id:feedback-id:reply-to:date:mime-version
         :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to;
        bh=i64gZByl0aL/n86QsLVYFQT8GEDofGosCZrPStNsIaE=;
        b=aW0S1/tJvwL7rV7CfEpKnOUmpA6hukH06lXn4PlTJa2JRNxqEzS1e0uqF1J2Rkse5g
         nQjAD+E1eYUwiwY9OTKhmi4M8yDm+iThFx/IqcUxe80K4gYPvAvvn2k7Y93jmCWFCsud
         DWSVofEEZt3MHrG1OUgkSVTd/YhnP6Wh5fzPGjHf19Tb+7q8oHrwUw0iSYX+eLN2agsK
         rwiut7045ttIywEp1Ew/eonJO006N9VpSLVUod/PpZFT22cF5yIqCMOSvIT24Iiicnz7
         z3CjToEMPXSdG/0tBlSfm659c6g2of64GTDKq9uCmg0Ov4tMu4MBAC/q+cdmU3CTRIZt
         Ndwg==
X-Gm-Message-State: ABy/qLbGmcEyWXk7XHD1tfRlAkokSdhiX4pDrfdGGeznC0H2XQTlFOYR
	j1/uqi1y6nnr1kjRDlFjmp6L
X-Google-Smtp-Source: APBJJlF7s3hFeh1FGcDl9SEs+uUtGJkzoh1BPJRzXbzuJajB66Ku7k11Kw27p1FudlJja6u5+V8VBf8=
MIME-Version: 1.0
X-Received: by 2002:a05:6830:12c4:b0:6b9:513:e364 with SMTP id
 a4-20020a05683012c400b006b90513e364mr19845997otq.1.1691088214819; Thu, 03 Aug
 2023 11:43:34 -0700 (PDT)
Date: Thu, 03 Aug 2023 11:43:34 -0700
Reply-To: Google Community Team <googlecommunityteam-noreply@google.com>
X-Google-Id: 4170663
Feedback-ID: P-232-0:C20113407:M110506633-en-GB:gamma
X-Notifications: c9652bb6f2240000
X-Notifications-Bounce-Info: AYb2H12cFc7HOt_K6PgMJGHQsxou0pO7wkS_zLIYClPJQ8yRaPGey4Lcj-BfyhHf-U7Xu94QFUCeWFle5y-bcDDDpFks8TGBEiS9GhuNTlWISSsb0-5H1esrIpiGrIDkCO7wN7uwgKejtBhbYkvPPW5eaBkdpaHBp-Sgxj_DqVIMMod_sHZySO40RFpKR6pjUUr9zBCI6mV9iPn2z4fJHa55ZlV7GHU5DX-SMzY7Zr47jUYHzCK3dPuMly1Ddw7SflbtBF83xmOrPRyExivsy0SMAVNoaoPACKSPe7aNgi2nk3Vmv4EVG2VAxVZ_07i7GNKpWFU1shKWhx1ca1F5Ms5gQNHk40s9cTe8OULlTLSvxqZvjNV8b7qFNjAwNjA0MDQxNTM1NTk2OTMzMg
Message-ID: <2bde4d71828b89f6c5a398cb0602825b6171e035-20113407-110708208@google.com>
Subject: Royale, finish setting up your new Google Account
From: Google Community Team <googlecommunityteam-noreply@google.com>
To: royalescrap@gmail.com
Content-Type: multipart/alternative; boundary="0000000000005403e7060209280f"

--0000000000005403e7060209280f
Content-Type: text/plain; charset="UTF-8"; format=flowed; delsp=yes
Content-Transfer-Encoding: base64

DQoNCkhpIFJveWFsZSwNCg0KV2VsY29tZSB0byBHb29nbGUuIFlvdXIgbmV3IGFjY291bnQgY29t
ZXMgd2l0aCBhY2Nlc3MgdG8gR29vZ2xlIHByb2R1Y3RzLCAgDQphcHBzIGFuZCBzZXJ2aWNlcy4N
Cg0KSGVyZSBhcmUgYSBmZXcgdGlwcyB0byBnZXQgeW91IHN0YXJ0ZWQuDQoNCg0KR2V0IHRoZSBt
b3N0IG91dCBvZiB5b3VyIEdvb2dsZSBBY2NvdW50DQoNCldlJ2xsIHNlbmQgeW91IHBlcnNvbmFs
aXNlZCB0aXBzLCBuZXdzIGFuZCByZWNvbW1lbmRhdGlvbnMgZnJvbSBHb29nbGUuDQoNClllcywg
a2VlcCBtZSB1cGRhdGVkICANCjxodHRwczovL25vdGlmaWNhdGlvbnMuZ29vZ2xlLmNvbS9nL3Av
QU5pYW81cm1fZFdyWHhobU5OWlhyeUtta3FXODdrQjgzX0NiX2o1emRKdkhEc21lMzU5QnZ3TFJS
M3JnMDgyNzFrNGhmcGhzNEhJaHhGOVJPdXZBUVV6S09UZFF1R1dBUHFsbzJjZzdRNnZzbG5QNk1D
UUNoSVpGeGs1NkRoN1lsY3BpdVZKSUpKd2RNZ1FLZ2dmUmRCTFRlNGFWZEgzaUF3SUNmR3NuUExu
X2d1anRzX2J0THFNZHdEMWgwUTEzd2wtalZ3NTdTcHBhNkJXQXBjdVFwZzQxUXJBYmhDSHJ2ZEVW
d2h1YkFnRG0wc0V4U1VvOXNTbUFpc2NZbjhxemJyeEt0T1MxWS1mSWpJbFNLcDZfX3hGOUlkdTJj
X2dGQ0hFWUJTS3I1RzRaX0s2UHZWei00RG5LdW4yNXFZTGw5WkFyLWtRbmlBeXVRSjdsWXgzNnE0
TUYyUmdzZXRPUXo5ekJRb0QxU2VOTV9uczlmNzRfM004c0Nuc1BBNFZVQTVkbmNnNlZRUDg1T1ZD
c3piYzVYY05IeGNQY09vTGlvMVhpdUJtWTAwV2s3WmxPekoyZGVQdDNaQUxzOXNWbGxRSy1MS2I4
ZFZucURnWEFOakVENVdDcDFLcGc0cmM1NEJxM05jMGx3SVdsbGVNZGtSaUNoUXU5WlRUMWNxaDB4
ZjlVbXpQaG9SUFN1N3ZzZTZ3alBsQl93NzI4Rm85dE1TSmJqbnlKLXEzWkZLR3hZckZsM0w0MXhR
RkVfdFJFTXRSZ2pDLTJSenFMNWFLcEs5UjZhNVBtQVh3Q2FjbGR3NDRXUDYtUT4NCg0KU3RheSB1
cCB0byBkYXRlIHdpdGggdGhlIEdvb2dsZSBhcHANCg0KRmluZCBxdWljayBhbnN3ZXJzLCBleHBs
b3JlIHlvdXIgaW50ZXJlc3RzIGFuZCBzdGF5IHVwIHRvIGRhdGUuDQoNClRyeSBpdCAgDQo8aHR0
cHM6Ly9ub3RpZmljYXRpb25zLmdvb2dsZS5jb20vZy9wL0FOaWFvNXJ5aVJZcmc5SV80S1VOTGlR
a1FUR0tqOEs4X2k4SmZKMDhydVYzUTBqQk9abUZPVGMxdjhYRldnbHpVcFZvc3R4MlpjTnd3djNO
dHJVV2FZdGRWVzNUSk9VaTJQQjF3RjZPdVVScDVMM1FnQm9TXzNxbDNXbDVFcTFobF9LaUM1MzR5
NERRd2NnRFFUZ1lYVFRNRWdBeEk0ZEcwMENzM2pkWDNJamVVNWJQZHhFUE9Vc0xHUmFCdFNfc2Vw
Y3VVWDUzWmdwX3c2d3U5NFZVcTJQYUw1eTBPcE5lMVUtanF4QXlhUk5zaVBXWWd2Z2M0X0kySll1
cEJfc29hNUJFSThsMFNmdjRnM00ySTlKZl91RWZNNXlkMkJBNHZXMS0wdGh4TjB6ckF6dkpjV3E1
Q2NTR0JvVDQ4eTlGUlV6VGpQMkx6dVQ5Q3BNbC1JQWN3a28wUEgzVjhIYXVUNWFjRENLMmVqUGNO
c1hXRlYyMXlTU3A+DQoNCk1vcmUgZnJvbSBHb29nbGUNCg0KRGlzY292ZXIgdGhlIGxhdGVzdCBh
cHBzIGZyb20gR29vZ2xlLg0KDQpGb3IgQW5kcm9pZCAgDQo8aHR0cHM6Ly9ub3RpZmljYXRpb25z
Lmdvb2dsZS5jb20vZy9wL0FOaWFvNXB3dDEzc3kycGRqc243ZTB2NDVLNWFuV0NOanNXeW5yV2s4
UVhkUDRLZFV6bmRqWGlldTZCN1VfZ0FFdXlfVkY1aTFXU0tiTk1HN2hxSzl2MC13RXBMbk1LOHMw
NGNYRUxyMXRKVG5CVUpCcEhJNjJlZ2tjX1BiSHNRcl9FbU9BdmJocmROQXB1aWJpVUswdDc5UmNw
eWJPMWE5dlRiaWpXamN2VnZxVi1fd3cySTJSdThZdmxqYUJpZ183YjlELUVmNDJWcTBkM1RMTHI5
enV0d3R6SnhzTXRpQmF0X2FrUm5zQlFGZGhKWGhQR3BhVEVmbDQydE9qVGtaZE83eW1MLVp1Um5O
TnlabXExSFVfcFJwTkdLdjBQTUZBTlBZRnBSMGQtY2JDVy1yVGd4M25yZG5rUDNDbnZQaHRpbnBD
anZxSnpOMkRGZDlOSm1WVnUzeWFpdE5NckprQmhaWkNvM283aG9qc0luRk1pNzVWZU5kN1A2Z050
Ujk4YmprTUpyXzNZd1Z1c2NyWloxTldqMTZzRzdtU0VUVVJ6dm1FeUlzWVlrdFJhXzM1ZWFTbzl0
YzczbmV0OVVLOGdRejJPXzJZOHhDX2xNb2htMFNqOXRlZTA0M01qbWVBZXZGTmRaTURVY0tJSlM1
TUdjejVBQ2pQeGo3ZElDaUFmVWxXXzhiVW1tbVl4Y28tZFFZcEJpTkNEaURRdWdudExsWWNVanA0
N0d5SDZ5MWZOOEFLWnZqZkotV1FKclQ1NXBGdWo3eWZaTGROT1RHMmRqZGZCZHV3UkNfZmNncC0x
RjVWTy16U1B2dE5tV2ZWQXVBRDJWaURqdGVlSlY1dUp6VU9qRlJ0Tm9pSlkwMExUbnc5ZWN5dz4N
Cg0KRm9yIGlPUyAgDQo8aHR0cHM6Ly9ub3RpZmljYXRpb25zLmdvb2dsZS5jb20vZy9wL0FOaWFv
NW9mQnhaN3hxeXNkdEx4czFELTJYS3NOZmJzSGlURDBkTXhWRTVUNnRXenZwNnJnbVVVeVE3b04t
YkVmb0c2eDNpX2NDeXdYTlhUWVE0WlpKSk9UNWhKc21wV1BEd3hJZ0E0U3MxdWF4RlFDS29GbHdU
d2E1ZWsyUExGVzJOR3FFVG5Nb3M1eUdDQWtWS2pKSm9MUUhxRlFsVTNsNFppVUp4dy1KQnh1eDR2
WmlmanUxT0pjOVZZenVBY3BfZnl2WFQwWDUyMnhJWndDUlVwTzNpQ0tNNHZ2WHV0MHk2NnZyS0pq
eXFvWGJCZUJWRUctS21KWHJHTmp5NTlmekkyRm9fSEp6LUQtUWV6b2o1ZEEtYWdpb0ZOTXlHWlFp
dTc2Y0duZW5Tc0l2MDBpRUlRdXNnaDI4dVdRbk94RWhWOUxNVm1FM191SHY4Rkh1bTI0dEhZLWQ3
Vkx0YWEzLXdseUxsZ1g3OVByUHFmVGVkSTk0R1EtbkptRm1jUXNCTDFlbnBFUHpabD4NCg0KQ29u
ZmlybSB0aGF0IHlvdXIgb3B0aW9ucyBhcmUgcmlnaHQgZm9yIHlvdQ0KDQpSZXZpZXcgYW5kIGNo
YW5nZSB5b3VyIHByaXZhY3kgYW5kIHNlY3VyaXR5IG9wdGlvbnMgdG8gbWFrZSBHb29nbGUgd29y
ayAgDQpiZXR0ZXIgZm9yIHlvdS4NCg0KQ29uZmlybSAgDQo8aHR0cHM6Ly9ub3RpZmljYXRpb25z
Lmdvb2dsZS5jb20vZy9wL0FOaWFvNW9wMXgtaEhENHhqTElCWVM2VzE0MGV5VGVqNlU3TmdxeHlF
bU4yV04wd0o4amxOZmhjNzhMRDJieXB6RU5GeVZEX1ZiU3ZIVHdFbDdZNGt5VFliRUdRWHBRVldQ
MHJrY1BBcVZQbklXajlkaVpYS29IYVJFaDY0Z3F2U2hkSkxlNWVBYXNfQ29GZ3kzNU5BTFIwVFNl
REx2dGpvTGRDajZHVzQydHpJRDBrMzlfU1MxVC1rTndOZkhjZXM0WXBzLVpXWFc5UXJyc0hqTzh3
NDlKMHhjWkxOVWxUREkxTERCUGtvSGJwQzVuRXpqN0dJcGFRMFBOR01ib2tjSjd1Zkk5VU1SRGNH
NTdHcmdWRFB3bERYMG5nbXhhVjgxNENudjJ5emJrUXY3cjU2MDJGYUpjUzkwSmRFTlZjZHM1MDY5
eXc1enI0bXBneEZZdz4NCg0KRmluZCBhbnN3ZXJzDQoNClZpc2l0IHRoZSBIZWxwIENlbnRyZSAg
DQo8aHR0cHM6Ly9ub3RpZmljYXRpb25zLmdvb2dsZS5jb20vZy9wL0FOaWFvNXFiVmg4cV9Ca2Vk
dTBJM3o2Ymx5a1hWZHp6UzJIUm9yS1ZnOGJzQXVIME1IRmxUWkZhSzg4bnQ3ZUc4SFlhS3gxTGtz
T2ZqMUJWVkR6eGxheTc1bDExcnNLX3VwNS1vbTRpZW8tNHJXOHRSSDJSclZkbnVvOFBkR0FtSXpO
ZzM2bGh5X1loV2JPbzF4MkJ3SzI3X1VmZnpzX21ZeWVlTDIwY1YxODVxMXJ5OEFsU3lJQXVFNFpN
aUhfdk4yMGRRbGc4Z1Y0MEEzd29GVjQ3WWVNU0Y0c0ZBMzU3a1UweC1NWktSazVwazhLdGlQUEY1
a3ROVWdKZWlDal8xQ1RfNlYwdFdCWDkxRUZWeVdXMDFhbEFjbWpGb3dlNkdvdG1TR3Z6M2xDNUxr
RT4gIA0KdG8gbGVhcm4gYWxsIGFib3V0IHlvdXIgbmV3IEdvb2dsZSBBY2NvdW50Lg0KDQoNClJl
cGxpZXMgdG8gdGhpcyBlbWFpbCBhcmVuJ3QgbW9uaXRvcmVkLiBJZiB5b3UgaGF2ZSBhIHF1ZXN0
aW9uIGFib3V0IHlvdXIgIA0KbmV3IGFjY291bnQsIHRoZSBIZWxwIENlbnRyZSAgDQo8aHR0cHM6
Ly9ub3RpZmljYXRpb25zLmdvb2dsZS5jb20vZy9wL0FOaWFvNXJfZUp3b19oSzRJN0FUbk5hOE54
WURQc2FoYldFRDdlYXFCRVp4bVl2YmV4WHpESkozZFdHRVp0eHpMWDBNNDdkWnNCZEY0OHhuSFdV
a24xWWt4U0FTSFFWa2REeml2ZUwxTU4zbDRrU0hBdGNuZ3pETDRGNlVfVW9BdnhmUnNzcE95QWFL
ZHhyS21xRDg3TW5ld2dIeElZRWFGWERuR0pqUk12MFhmUERsR3ZrNGMwMjVZQm5FUEhzQWZyVXp4
aTRzbjYxVEowR08ydlcxVFFlNTVsRkxRV21JbzRNZmRCRE03dVg4Tm1WWDhIcFEtZWpRTFM5YTRB
U1E5RU9CUVJQWGpQdlZQdEM4WGxDdUxtRU1KOTFvcVJwRWstcjlQMFlXcHB2cTVKdWJzWnZyWkI0
PiAgDQpwcm9iYWJseSBoYXMgdGhlIGFuc3dlciB0aGF0IHlvdSdyZSBsb29raW5nIGZvci4NCg0K
DQoNCkdvb2dsZSBMTEMgMTYwMCBBbXBoaXRoZWF0cmUgUGFya3dheSwgTW91bnRhaW4gVmlldywg
Q0EgOTQwNDMNCg0KVGhpcyBlbWFpbCB3YXMgc2VudCB0byB5b3UgYmVjYXVzZSB5b3UgY3JlYXRl
ZCBhIEdvb2dsZSBBY2NvdW50Lg0K
--0000000000005403e7060209280f
Content-Type: text/x-amp-html; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

<!doctype html>
<html =E2=9A=A14email data-css-strict lang=3Den-GB>
<head>
<meta charset=3Dutf-8>
<script async src=3Dhttps://cdn.ampproject.org/v0.js></script>
<script custom-element=3Damp-bind src=3Dhttps://cdn.ampproject.org/v0/amp-b=
ind-0.1.js async></script>
<script async custom-element=3Damp-form src=3Dhttps://cdn.ampproject.org/v0=
/amp-form-0.1.js></script>
<style amp4email-boilerplate>body{visibility:hidden}</style>
<style amp-custom>
body{text-decoration:none;}
td.table-cell.subheadline.space6.module_para {
padding: 0 50px;
}
.pdngrtl{padding:7px 24px 7px 24px}
.localepading{padding:8px 26px 7px 26px; font-size:16px;}
.space6{padding:0 80px 0 80px;}
.space2{padding:0 70px 0 70px;}
.widthmin{min-width:115px;}
.addingspace{width:6px; display: inline-block;}
@media only screen and (max-width: 767px){
.btn_mod2_mobile1{padding:9px 24px 11px 24px ; border-radius: 4px ;}
.btn_mod2_mobile2{padding:9px 24px 11px 24px ; border-radius: 4px ;}
.btn_mod3_mobile{padding:9px 24px 11px 24px ; border-radius: 4px ;}
.btn_mod4_mobile{padding:9px 24px 11px 24px ; border-radius: 4px ;}
.pdngrtl{padding:7px 11px 7px 11px}
.space1{height:19px ;}
.space2{padding:3px 35px 0 35px ;}
.space3{padding-top: 22px ;}
.space4{padding: 6px 0 0 0 ;}
.space5{padding-top: 17px ;}
.space6{padding:0 35px 0 35px ;}
.space7{padding-right: 0px ;}
}
@media screen and (min-resolution: 288dpi) {
.device_txt{font-size:26px;}
}
/* Potrait for iPhone */
@media only screen and (device-width: 375px) and (orientation:portrait){
.fmd_mobile {padding-top:5px ;color:red ;}
}
body{text-decoration:none;}
</style>
<!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
<!--[if mso]>
<style>a{color:4285f4; text-decoration:none;}</style>
<![endif]-->
</head>
<body class=3Dbody_wrapper style=3D"padding: 0 6px;">
<div style=3D"font-size: 0px; line-height:0px; color: #ffffff; display: non=
e;">=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=
=C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=
 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0=C2=A0 =C2=A0 </div>
<table role=3Dpresentation class=3Dbody_size border=3D0 cellspacing=3D0 cel=
lpadding=3D0 align=3Dcenter width=3D100% bgcolor=3D#ffffff style=3D"backgro=
und: #ffffff; width:100%;max-width: 520px;">
<tr><td align=3Dcenter style=3D"padding-top: 20px;"> <amp-img role=3Dpresen=
tation class=3Dgoogle_mobile width=3D82 height=3D26 src=3Dhttps://www.gstat=
ic.com/gumdrop/files/google-logo-header.png style=3D"width: 82px; height:26=
px; text-align: center; border: none;">
</td></tr>
<tr><td class=3Dspace1 height=3D15></td></tr>
<tr>
<td width=3D100% style=3D"width:100%; max-width:480px; border: 2px solid #D=
FE1E5; border-radius: 8px;">
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 width=
=3D100%>
<tr>
<td align=3Dcenter>
<amp-img role=3Dpresentation class=3Dtop_img width=3D516 height=3D109 src=
=3Dhttps://www.gstatic.com/gumdrop/files/banner.png style=3D"width: 100%; t=
ext-align: center; border: none;" layout=3Dresponsive>
</td>
</tr>
<tr>
<td>
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 align=
=3Dcenter width=3D100%>
<tr>
<!--[if mso]>
<td align=3D"center" class=3D"greeting_name space6" style=3D'color:#202124;=
 font-family:Google Sans, Roboto, Arial; font-size:28px; font-weight:normal=
; line-height:44px; margin:0; padding:0 80px 20px 80px; text-align:center;w=
ord-break:normal;direction:ltr;' dir=3D"ltr">
Hi Royale,
</td>
<![endif]-->
<!--[if !mso]><!-->
<td align=3Dcenter class=3D"greeting_name space6" style=3D"color:#202124; f=
ont-family:Google Sans, Roboto, Arial; font-size:28px; font-weight:normal; =
line-height:44px; margin:0; text-align:center; word-break:normal;direction:=
ltr;" dir=3Dltr>
Hi Royale,
</td>
<!--<![endif]-->
</tr>
<!--[if !mso]><!-->
<tr>
<td height=3D15 style=3D"line-height: 4px; font-size: 4px;"></td>
</tr>
<!--<![endif]-->
<tr>
<td class=3D"subheadline space2" align=3Dcenter style=3D"color:#3C4043; fon=
t-family:&quot;Roboto&quot;, OpenSans, &quot;Open Sans&quot;, Arial, sans-s=
erif; font-size:16px; font-weight:normal; line-height:24px; margin:0; text-=
align:center; word-break:normal;direction:ltr;" dir=3Dltr> Welcome to Googl=
e. Your new account comes with access to Google products, apps and services=
.</td>
</tr>
<tr>
<td class=3D"subheadline space6" align=3Dcenter style=3D"color:#3C4043; fon=
t-family:&quot;Roboto&quot;, OpenSans, &quot;Open Sans&quot;, Arial, sans-s=
erif; font-size:16px; font-weight:normal; line-height:24px; margin:0; text-=
align:center; word-break:normal;direction:ltr;" dir=3Dltr> Here are a few t=
ips to get you started.</td>
</tr>
<tr><td height=3D45></td></tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr><td height=3D24></td></tr>
<tr>
<td width=3D100% style=3D"width:100%; max-width:480px; border: 2px solid #D=
FE1E5; border-radius: 8px;">
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 width=
=3D100%>
<tr>
<td style=3Dpadding-bottom:50px;>
<table role=3Dpresentation class=3Dtable align=3Dcenter cellpadding=3D0 cel=
lspacing=3D0 style=3D"text-align: center; margin: 0 auto;">
<tr class=3Dtable-row>
<td class=3Dtable-cell style=3Dheight:50px></td>
</tr>
<tr class=3Dtable-row>
<td class=3Dtable-cell align=3Dcenter>
<amp-img role=3Dpresentation width=3D48 height=3D48 src=3Dhttps://www.gstat=
ic.com/images/branding/product/2x/email_64dp.png style=3Dwidth:48px;height:=
48px;text-align:center;border:none;font-size:9px class=3DCToWUd></amp-img>
</td>
</tr>
<tr class=3Dtable-row>
<td class=3Dtable-cell style=3Dheight:15px></td>
</tr>
<tr class=3Dtable-row>
<td class=3Dtable-cell style=3D"color:#202124; font-family:Google Sans, Rob=
oto, Arial; font-size:18px; font-weight:normal; line-height:33px; margin:0;=
 padding:0 30px 0 30px; text-align:center; word-break:normal; direction:ltr=
;" dir=3Dltr>Get the most out of your Google Account</td>
</tr>
<tr class=3Dtable-row>
<td class=3Dtable-cell style=3Dheight:15px;line-height:4px;font-size:4px></=
td>
</tr>
<tr class=3Dtable-row>
<td class=3D"table-cell subheadline space6 module_para" style=3D"color:#5f6=
368; font-family:Roboto, OpenSans, Open Sans, Arial, sans-serif; font-size:=
16px; font-weight:normal; line-height:24px; margin:0; text-align:center; wo=
rd-break:normal; direction:ltr;" dir=3Dltr>We&#39;ll send you personalised =
tips, news and recommendations from Google.</td>
</tr>
<tr class=3Dtable-row>
<td class=3Dtable-cell style=3Dheight:30px;></td>
</tr>
<tr class=3Dtable-row>
<td class=3Dtable-cell style=3Dtext-align:center;padding:0>
<table role=3Dpresentation class=3Dtable align=3Dcenter cellpadding=3D0 cel=
lspacing=3D0 style=3D"text-align: center; margin: 0 auto;">
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;">
<td style=3D"border-top: 4px; height:4px;border-top-left-radius: 4px;border=
-top-right-radius: 4px;display:inline-block; text-align: center;"></td>
</tr>
<tr class=3Dtable-row>
<td class=3Dtable-cell style=3Dtext-align:center;padding:0>
<form class=3D"sample-form hide-inputs" method=3Dpost action-xhr=3Dhttps://=
www.google.com/dynamicmail/optin?tok=3DAK3R_ckIHse_1DzYS5b5RgkP0fmiQ0iiiMY2=
t_Jpf99ywD4Zmyk3ylGq8uTB7sxr16oFbo4eJg=3D=3D&amp;ctrk=3Dhttps://notificatio=
ns.google.com/g/p/ANiao5qaYPTN80RxkeyfED3C7aFBmGOPjHWUjOLzK6j68L7LMg8uSptee=
TOMMZC-cmCnpZZCOGMdwmynD38ONgYorBnkiJkzWT9rXYe4c92zLOAcyVKufv1L5xHxXWEhCok1=
AGPMYR6G35H9rc1uQKGqdq9IvXaECaPlAnNJfCbphwfwlb1ETXRJ74u0OqNxjXR-CjB4FfTVF4l=
1IcjPMl1YCi2yiSCcmfP7DNmK>
<button [hidden]=3Dcta_submit role=3D"" tabindex=3D"" on=3D"tap:AMP.setStat=
e({sign_up: true, cta_submit: true})" type=3Dsubmit value=3D"" style=3D"bac=
kground-color:#1a73e8; border:1px solid #1a73e8; border-radius:4px; color:#=
FFFFFF; font-family:Google Sans, Roboto, Arial; line-height:24px; text-deco=
ration:none; min-width:180px; font-weight:500; text-align:center; word-brea=
k:normal; direction:ltr;" class=3Dlocalepading>Yes, keep me updated</button=
>
<div submitting>
<a style=3D"background-color:#5F6368; border:1px solid #5F6368; border-radi=
us:4px; color:#FFFFFF; display:inline-block; font-family:Google Sans, Robot=
o, Arial; font-size:16px; line-height:25px; text-decoration:none; min-width=
:180px; padding:8px 18px 7px 17px; font-weight:500; text-align:center; word=
-break:normal; direction:ltr" dir=3Dltr target=3D_blank>One moment=E2=80=A6=
</a>
</div>
<div submit-success>
<a style=3D"background-color:#188038; border:1px solid #188038; border-radi=
us:4px; color:#FFFFFF; display:inline-block; font-family:Google Sans, Robot=
o, Arial; font-size:16px; line-height:25px; text-decoration:none; min-width=
:180px; padding:8px 18px 7px 17px; font-weight:500; text-align:center; word=
-break:normal; direction:ltr" dir=3Dltr target=3D_blank>You&#39;ve signed u=
p</a>
<div class=3Dtable-row>
<div class=3Dtable-cell style=3Dheight:20px></div>
</div>
<table width=3D80% role=3Dpresentation align=3Dcenter cellpadding=3D0 cells=
pacing=3D0 style=3D"text-align: center; margin: 0 auto; width: 80%;">
<tr class=3Dtable-row>
<td align=3Dcenter class=3Dtable-cell style=3D"background-color: #ffffff; c=
olor: #5F6368; font-family:Roboto, OpenSans, Open Sans, Arial, sans-serif; =
font-size: 14px; line-height: 21px; text-align:center; margin: 0 auto; padd=
ing:0px;">You can unsubscribe at any time in the messages that you receive.=
 You can also <a href=3Dhttps://notifications.google.com/g/p/ANiao5oLYG3vpx=
om3psVcDBZivUyRUumHdK51KdVUvDi3LIrocOE-Qykk9Mf28ET7kLCPijka9LE6Y13ny8ry3U0d=
Kcd4cxC0B3OiOqMOXlVQf2NoRz_jElO0GOLaeHDBsqoR7RlNGzJAVg1UxaPeJMQ-a5pCeNVTQW6=
HhtCHPb061YWTvWBdhnTePbomr8lsA_EFs_VazYl-TpTSwU6LXoQs5czHvknm_VEFv7Yl-t2gBz=
tlTK93MohJBjqETA5nY9kqILV7nrx9ffwkiPiO7L0YFP_wKmWfY0t3yI1LJD1fl_Q3Y5rKv4II0=
i_Y_7YDqSaaBReQii0C5j2m585dqJ1RXBvfTA_B5GKabrJFzH29jPsjLIZSJkz2zJzmu6Xgmb6c=
5fTSh56odJL2Y1PUveOc1Q5fk7Wj2ar2GbfkFm11GKPLjb4J8JOyOYaUo8iqoe0RtxWvzXXprN4=
68SLE5oHXoUq9EQCFPvkAGGk98qoFSRiJrRJyT8YEUgILkSZD4AH8Vi9mqng5OWjEOWQUd2SWWv=
T5yKbENUTjyVI42BwX1ZCgTayJ5_2azNPj9hu77ZEiUxkAXatweXFUwpWL3kY7YgTKmtKdFldvh=
NYIkUbNX3JMTHia2_XVxpi7M52h412 target=3D_blank style=3D"color:#1A73E8; text=
-decoration: underline; font-weight:normal; border:0; white-space: nowrap; =
">manage your preferences</a>.
</td>
</tr>
</table>
</div>
<div submit-error>
<a href=3Dhttps://notifications.google.com/g/p/ANiao5pVCv_WRqi3xPZv9KBrKimW=
V6T2dIZrrkjuTiFqkPVq9IlZfQ54v4TxIFazXZ2UxnPAfaE-1tUnQn1H525VmBpb0iQxhbl8KJw=
9OgSlh0XZMvU8aGOOt6IPAMoHiuW9GrWZxCOp515xHe5rLDjP5T_2bxVIibUbYsVm9ma6wDZAYf=
RzR5lddAPzPtODkRBLI_VAQnUeYtzsQzPG3wu_p6u11KDK6BgI-mHgOzq3qmT8Wq2NYwrYwAA7s=
I_oXiF4DIKm2RXesQh7c2I2CSJ8xcPUum8Y98F7OkpFkmzCwP-ga6HSkdl1mA6VvPu3XuCF3z5l=
Ok5w0DoLGaCU8wjqImUIhpfG4kVE4bhlwV1eCdgGrf324ERZw4qRVg2XY1sbkjVu84axiHnBaLh=
DkDRAVKX5_mMsoszA5qb7UCRuSJn09D0CNNSA5ZFcwGaRSdhK3bD8ee7vOffjqxTbGhuA9XWyL3=
uM8pjA4295eEXqv64JmO39cqi-6JccXJAPoCtS3HE9CdiCAui6xKLttamUc6KADlXkHpLsqBkqJ=
DkrDVFTe8olsrnxEcHviejfRhe1Q_ZKMT5oJiWtHOQIJ-Wl8FYNrw6jr8xyY1SbwJ349oY targ=
et=3D_blank>
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0>
<tbody>
<tr>
<td style=3D"text-align: center; background-color:#1A73E8; border:1px solid=
 #1A73E8; border-radius:4px; color:#ffffff; display:inline-block; font-fami=
ly:Google Sans, Roboto, Arial; line-height:24px; text-decoration:none; min-=
width:167px; padding:8px 24px 7px 24px; font-weight:500; text-align: center=
; word-break:normal;direction:ltr;" dir=3Dltr class=3Dcta_gl>Try again=E2=
=80=A6</td>
</tr>
</tbody></table>
</a>
</div>
</form>
</td>
</tr>
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;">
<td style=3D"border-top: 3px; height:3px; border-top-left-radius: 4px; bord=
er-top-right-radius: 4px; display:inline-block; text-align: center;"></td>
</tr>
</table>
</table>
</td>
</tr>
</td>
</tr>
</table>
</td>
</tr>
<tr><td height=3D24></td></tr>
<tr>
<td width=3D100% style=3D"width:100%; max-width:480px; border: 2px solid #D=
FE1E5; border-radius: 8px;">
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 width=
=3D100%>
<tr>
<td>
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 align=
=3Dcenter width=3D100%>
<tr><td height=3D50></td></tr>
<tr>
<td align=3Dcenter> <amp-img role=3Dpresentation class=3Dmodule_mobile widt=
h=3D48 height=3D48 src=3Dhttps://www.gstatic.com/gumdrop/files/google-logo.=
png style=3D"width: 48px; height:48px; text-align: center; border: none; fo=
nt-size:9px;">
</td>
</tr>
<tr><td height=3D15></td></tr>
<tr>
<!--[if mso]>
<td align=3D"center" class=3D"device_txt space6" style=3D'color:#202124; fo=
nt-family:Google Sans, Roboto, Arial; font-size:18px; font-weight:normal; l=
ine-height:33px; margin:0; padding:0 80px 20px 80px; text-align:center; wor=
d-break:normal;direction:ltr;' dir=3D"ltr">Stay up to date with the <span s=
tyle=3D"white-space:nowrap; " class=3D"">Google app</span></td>
<![endif]-->
<!--[if !mso]><!-->
<td align=3Dcenter class=3D"device_txt space6" style=3D"color:#202124; font=
-family:Google Sans, Roboto, Arial; font-size:18px; font-weight:normal; lin=
e-height:33px; margin:0; text-align:center; word-break:normal;direction:ltr=
;" dir=3Dltr>Stay up to date with the <span style=3D"white-space:nowrap; " =
class=3D"">Google app</span></td>
<!--<![endif]-->
</tr>
<!--[if !mso]><!-->
<tr>
<td height=3D15 style=3D"line-height: 4px; font-size: 4px;"></td>
</tr>
<!--<![endif]-->
<tr>
<td class=3D"subheadline space6" align=3Dcenter style=3D"color:#5F6368; fon=
t-family:&quot;Roboto&quot;, OpenSans, &quot;Open Sans&quot;, Arial, sans-s=
erif; font-size:16px; font-weight:normal; line-height:24px; margin:0; text-=
align:center; word-break:normal;direction:ltr;" dir=3Dltr>Find quick answer=
s, explore your interests and stay up to date.</td>
</tr>
<tr><td height=3D30></td></tr>
<tr>
<td class=3Dspace4 style=3D"text-align: center; padding: 0;">
<div>
<!--[if mso]>
<v:roundrect xmlns:v=3D"urn:schemas-microsoft-com:vml" xmlns:w=3D"urn:schem=
as-microsoft-com:office:word" href=3D"https://notifications.google.com/g/p/=
ANiao5rIVTCjWTUBcAKbjAZWFnGGXXGwl7Jf9CdJ8L-m8AbcW0_-ewwTK5n3p5O_cVNWTyKsbez=
aY1tHgHNESXzWfIwitEjSlAqJKFhDqKWVe8Ff1fYteuAdEC0RohS3FjtgGkoPXvIHIoPn1HVfCK=
ATLhZ1R6SELOH15CjDv6sBxliUYLrElB_LjlOuH0zmaVbFjjLlMnkHtrwf89wiQ5C-CyIF4Q8ef=
XSiMUcymSBgqX7YhSPS9mN8rwX8imjne8GHx3pNE_2EoFF8sBetM4FJDeyJXKj4Ce_Y5kEFE3j3=
nlT1_c-1oc1WMyahpGSsht01Ama8shrypFd8ms-HWNpF9PycwZ-SYWaNNEZbPQNyLQIfRlkIWFV=
QPNc" style=3D"height:48px; v-text-anchor:middle; width:150px;" arcsize=3D"=
10%" strokecolor=3D"#1A73E8" fillcolor=3D"#1A73E8;">
<w:anchorlock/>
<center style=3D"color:#ffffff;font-family:Google Sans, Roboto, Arial; font=
-size:16px; font-weight:normal; word-break:normal;direction:ltr;" dir=3D"lt=
r">Try it</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a href=3Dhttps://notifications.google.com/g/p/ANiao5rIVTCjWTUBcAKbjAZWFnGG=
XXGwl7Jf9CdJ8L-m8AbcW0_-ewwTK5n3p5O_cVNWTyKsbezaY1tHgHNESXzWfIwitEjSlAqJKFh=
DqKWVe8Ff1fYteuAdEC0RohS3FjtgGkoPXvIHIoPn1HVfCKATLhZ1R6SELOH15CjDv6sBxliUYL=
rElB_LjlOuH0zmaVbFjjLlMnkHtrwf89wiQ5C-CyIF4Q8efXSiMUcymSBgqX7YhSPS9mN8rwX8i=
mjne8GHx3pNE_2EoFF8sBetM4FJDeyJXKj4Ce_Y5kEFE3j3nlT1_c-1oc1WMyahpGSsht01Ama8=
shrypFd8ms-HWNpF9PycwZ-SYWaNNEZbPQNyLQIfRlkIWFVQPNc target=3D_blank dir=3Dl=
tr style=3D"text-align: center; display: inline-block;">
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0 align=3Dcenter>
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td styl=
e=3D"border-top: 3px solid #ffffff;border-top-left-radius: 4px;border-top-r=
ight-radius: 4px;display:inline-block; text-align: center;"></td></tr>
<tr><td class=3D"subheadline btn_mod2_mobile2 enwid" style=3D"background-co=
lor:#1A73E8; border:1px solid #1A73E8; border-radius:4px; color:#ffffff; di=
splay:inline-block; font-family:Google Sans, Roboto, Arial; font-size:16px;=
 line-height:25px; text-decoration:none; padding:7px 24px 7px 24px; font-we=
ight:500; text-align: center; word-break:normal; direction:ltr; ">
Try it
</td></tr>
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td styl=
e=3D"border-top: 4px solid #ffffff;display:inline-block;border-bottom-left-=
radius: 4px;border-bottom-right-radius: 4px; text-align: center;"></td></tr=
>
</table></a>
<!--<![endif]-->
</div>
</td>
</tr>
<tr><td height=3D50></td></tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr><td height=3D24></td></tr>
<tr>
<td width=3D100% style=3D"border: 2px solid #DFE1E5; border-radius: 8px;pad=
ding-bottom:50px;width:100%;max-width:480px;">
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 align=
=3Dcenter width=3D100%>
<tr>
<td align=3Dcenter>
<amp-img role=3Dpresentation class=3Dtop_img width=3D514 height=3D207 src=
=3Dhttps://www.gstatic.com/gumdrop/files/apps-icons-image-2x-wd972px-ht390p=
x.png style=3D"width: 100%; text-align: center; border: none; border-top-le=
ft-radius: 8px; border-top-right-radius: 8px;" layout=3Dresponsive>
</td>
</tr>
<tr><td height=3D7></td></tr>
<tr>
<!--[if mso]>
<td align=3D"center" class=3D"device_txt space6" style=3D'color:#202124; fo=
nt-family:Google Sans, Roboto, Arial; font-size:18px; font-weight:normal; l=
ine-height:33px; margin:0; padding:0 80px 20px 80px; text-align:center; wor=
d-break:normal;direction:ltr;' dir=3D"ltr">More from Google</td>
<![endif]-->
<!--[if !mso]><!-->
<td align=3Dcenter class=3D"device_txt space6" style=3D"color:#202124; font=
-family:Google Sans, Roboto, Arial; font-size:18px; font-weight:normal; lin=
e-height:33px; margin:0; text-align:center; word-break:normal;direction:ltr=
;" dir=3Dltr>More from Google</td>
<!--<![endif]-->
</tr>
<!--[if !mso]><!-->
<tr>
<td height=3D15 style=3D"line-height: 4px; font-size: 4px;"></td>
</tr>
<!--<![endif]-->
<tr>
<td class=3D"subheadline space6" align=3Dcenter style=3D"color:#5F6368; fon=
t-family:&quot;Roboto&quot;, OpenSans, &quot;Open Sans&quot;, Arial, sans-s=
erif; font-size:16px; font-weight:normal; line-height:24px; margin:0; text-=
align:center; word-break:normal;direction:ltr;" dir=3Dltr>Discover the late=
st apps from Google.</td>
</tr>
<tr><td height=3D30></td></tr>
<tr>
<td align=3Dcenter valign=3Dtop>
<table role=3Dpresentation>
<tr>
<td style=3D"text-align: center; padding: 0;">
<div>
<!--[if mso]>
<v:roundrect xmlns:v=3D"urn:schemas-microsoft-com:vml" xmlns:w=3D"urn:schem=
as-microsoft-com:office:word" href=3D"https://notifications.google.com/g/p/=
ANiao5rVtKqvnminp9x22qQpzKiKvhgraaj9p9qc896jAyaShpAisQLIJuh2vy6h-L-DLK1hR8z=
5ZD6wI2nDU29V7TRKSFPGpMUryNwdQatchVU-S2N_A9jruRov2MTPnrjOYDc_nvoFMkFDCCF7PU=
ZxpBjxAlaCDJJwCG1NOT6ipQ4eu-uO2O1soOCowOV6651Waa_aOGhFPNhzZfmhCPOEpuGivAmqU=
TIwHo4z5B_KLNJ8pZVA3GOYs8tjZZaVBjRHxZB8Haoq9tm10azBlVP0LK7r0QnTMLIbKRZhoWBa=
qNQDt9zzAyVOTZ1eWwvKMMySvQwLeGxBFDRSTGIKl2bbYjYAW81U4wg9vcpmRgunJXNmIgFeAqG=
CMCZqP5dKybdZMwJaqDpE9kUI6dJWey60qdEdFAOuF0L4yI_7P8IJk38As417mdn6aOKV92q6u2=
OfwW-5ZQiqqk4EYDwUFJMXDZHSXFkQvr1Z1WtWtm57dNamGSdcBdsIwO7mzgyrjxvQayr_vSwh0=
L1FeIa7RUuTlZw8tRaJwjCw27c1AgwgnmbqEqcr8LkpeGd5RxqFiZDxapM6NYThnSzNz4MULJ6J=
Srs8IbT35vehIgZ8IWgv91hIa3jKBs56aIAXK682v5WV9FE5YKPOaFMI5k9t4C3xeKlM" style=
=3D"height:48px; v-text-anchor:middle; width:160px;" arcsize=3D"10%" stroke=
color=3D"#1A73E8" fillcolor=3D"#1A73E8;">
<w:anchorlock/>
<center style=3D"color:#ffffff;font-family:Google Sans, Roboto, Arial; font=
-size:16px; font-weight:normal; word-break:normal;direction:ltr;" dir=3D"lt=
r">For Android</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a href=3Dhttps://notifications.google.com/g/p/ANiao5rVtKqvnminp9x22qQpzKiK=
vhgraaj9p9qc896jAyaShpAisQLIJuh2vy6h-L-DLK1hR8z5ZD6wI2nDU29V7TRKSFPGpMUryNw=
dQatchVU-S2N_A9jruRov2MTPnrjOYDc_nvoFMkFDCCF7PUZxpBjxAlaCDJJwCG1NOT6ipQ4eu-=
uO2O1soOCowOV6651Waa_aOGhFPNhzZfmhCPOEpuGivAmqUTIwHo4z5B_KLNJ8pZVA3GOYs8tjZ=
ZaVBjRHxZB8Haoq9tm10azBlVP0LK7r0QnTMLIbKRZhoWBaqNQDt9zzAyVOTZ1eWwvKMMySvQwL=
eGxBFDRSTGIKl2bbYjYAW81U4wg9vcpmRgunJXNmIgFeAqGCMCZqP5dKybdZMwJaqDpE9kUI6dJ=
Wey60qdEdFAOuF0L4yI_7P8IJk38As417mdn6aOKV92q6u2OfwW-5ZQiqqk4EYDwUFJMXDZHSXF=
kQvr1Z1WtWtm57dNamGSdcBdsIwO7mzgyrjxvQayr_vSwh0L1FeIa7RUuTlZw8tRaJwjCw27c1A=
gwgnmbqEqcr8LkpeGd5RxqFiZDxapM6NYThnSzNz4MULJ6JSrs8IbT35vehIgZ8IWgv91hIa3jK=
Bs56aIAXK682v5WV9FE5YKPOaFMI5k9t4C3xeKlM target=3D_blank dir=3Dltr style=3D=
"text-align: center; display: inline-block;">
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0 align=3Dcenter>
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td styl=
e=3D"border-top: 3px solid #ffffff;border-top-left-radius: 4px;border-top-r=
ight-radius: 4px;display:inline-block; text-align: center;"></td></tr>
<tr><td class=3D"subheadline btn_mod3_mobile enwid pdngrtl widthmin" style=
=3D"background-color:#1A73E8; border:1px solid #1A73E8; border-radius:4px; =
color:#ffffff; display:inline-block; font-family:Google Sans, Roboto, Arial=
; font-size:16px; line-height:25px; text-decoration:none; font-weight:500; =
text-align: center; word-break:normal; direction:ltr;">
For Android
</td></tr>
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td styl=
e=3D"border-top: 4px solid #ffffff;display:inline-block;border-bottom-left-=
radius: 4px;border-bottom-right-radius: 4px; text-align: center;"></td></tr=
>
</table></a>
<!--<![endif]-->
<span style=3D"" class=3Daddingspace>=C2=A0=C2=A0</span>
<!--[if mso]>
<v:roundrect xmlns:v=3D"urn:schemas-microsoft-com:vml" xmlns:w=3D"urn:schem=
as-microsoft-com:office:word" href=3D"https://notifications.google.com/g/p/=
ANiao5qsa-RFkmr3bMhSeXDuZ197NseEkLqz1aLnq1NSFm1ctFYvt9Oao0LSeCJzdMPkJ1TJ9P3=
EmSy8QT4D44BkbYqZ8yaMD9qzE7ACwC9SPU2hkbkNa0R_s7SI-v0ElGbP3rkNsuykwuFmI4RW8t=
SBBi4-txxO3qqK1nqKholCzHW8221Yy1AJG6n9ZYxsuXfppplRMyIZm5mQWX3fzxRp4aKIEnueO=
KtQQubJamR51MZRceBrHtf2fG_zSAGkL9N51EaesCL-aRuuMomq7fsZxJQrI6u514AZ_1AVNe2S=
shdLD3yX2By0-bF6-YKI2DFmKmODIvaWUdoMwbmEuIQrFwznaLh22vjR1TSyBJfSQXf8M56769x=
fH0oJ_QyH_laRnP9kQ3bgAgc" style=3D"height:48px; v-text-anchor:middle; width=
:130px;" arcsize=3D"10%" strokecolor=3D"#1A73E8" fillcolor=3D"#1A73E8;">
<w:anchorlock/>
<center style=3D"color:#ffffff;font-family:Google Sans, Roboto, Arial; font=
-size:16px; font-weight:normal; word-break:normal;direction:ltr;" dir=3D"lt=
r">For iOS</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a href=3Dhttps://notifications.google.com/g/p/ANiao5qsa-RFkmr3bMhSeXDuZ197=
NseEkLqz1aLnq1NSFm1ctFYvt9Oao0LSeCJzdMPkJ1TJ9P3EmSy8QT4D44BkbYqZ8yaMD9qzE7A=
CwC9SPU2hkbkNa0R_s7SI-v0ElGbP3rkNsuykwuFmI4RW8tSBBi4-txxO3qqK1nqKholCzHW822=
1Yy1AJG6n9ZYxsuXfppplRMyIZm5mQWX3fzxRp4aKIEnueOKtQQubJamR51MZRceBrHtf2fG_zS=
AGkL9N51EaesCL-aRuuMomq7fsZxJQrI6u514AZ_1AVNe2SshdLD3yX2By0-bF6-YKI2DFmKmOD=
IvaWUdoMwbmEuIQrFwznaLh22vjR1TSyBJfSQXf8M56769xfH0oJ_QyH_laRnP9kQ3bgAgc tar=
get=3D_blank dir=3Dltr style=3D"text-align: center; display: inline-block;"=
>
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0 align=3Dcenter>
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td styl=
e=3D"border-top: 3px solid #ffffff;border-top-left-radius: 4px;border-top-r=
ight-radius: 4px;display:inline-block; text-align: center;"></td></tr>
<tr><td class=3D"subheadline btn_mod3_mobile enwid pdngrtl widthmin" style=
=3D"background-color:#1A73E8;; border:1px solid #1A73E8; border-radius:4px;=
 color:#ffffff; display:inline-block; font-family:Google Sans, Roboto, Aria=
l; font-size:16px; line-height:25px; text-decoration:none; font-weight:500;=
 text-align: center; word-break:normal; white-space:normal; direction:ltr;"=
>
For iOS
</td></tr>
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td styl=
e=3D"border-top: 4px solid #ffffff;display:inline-block;border-bottom-left-=
radius: 4px;border-bottom-right-radius: 4px; text-align: center;"></td></tr=
>
</table></a>
<!--<![endif]-->
</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr><td height=3D24></td></tr>
<tr>
<td width=3D100% style=3D"border: 2px solid #DFE1E5; border-radius: 8px;pad=
ding-bottom:50px;width:100%;max-width:480px;">
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 align=
=3Dcenter width=3D100%>
<tr><td height=3D50></td></tr>
<tr>
<td align=3Dcenter> <amp-img role=3Dpresentation class=3Dmodule_mobile widt=
h=3D48 height=3D48 src=3Dhttps://www.gstatic.com/gumdrop/files/security-log=
o.png style=3D"width: 48px; height:48px; text-align: center; border: none;"=
>
</td>
</tr>
<tr><td height=3D15></td></tr>
<tr>
<!--[if mso]>
<td align=3D"center" class=3D"device_txt space6" style=3D'color:#202124; fo=
nt-family:Google Sans, Roboto, Arial; font-size:18px; font-weight:normal; l=
ine-height:33px; margin:0; padding:0 80px 20px 80px; text-align:center; wor=
d-break:normal;direction:ltr;' dir=3D"ltr">Confirm that your options are ri=
ght <span style=3D"white-space:nowrap; " class=3D"">for you</span></td>
<![endif]-->
<!--[if !mso]><!-->
<td align=3Dcenter class=3D"device_txt space6" style=3D"color:#202124; font=
-family:Google Sans, Roboto, Arial; font-size:18px; font-weight:normal; lin=
e-height:33px; margin:0; text-align:center; word-break:normal;direction:ltr=
;" dir=3Dltr>Confirm that your options are right <span style=3D"white-space=
:nowrap; " class=3D"">for you</span></td>
<!--<![endif]-->
</tr>
<!--[if !mso]><!-->
<tr>
<td height=3D15 style=3D"line-height: 4px; font-size: 4px;"></td>
</tr>
<!--<![endif]-->
<tr>
<td class=3D"subheadline space6" align=3Dcenter style=3D"color:#5F6368; fon=
t-family:&quot;Roboto&quot;, OpenSans, &quot;Open Sans&quot;, Arial, sans-s=
erif; font-size:16px; font-weight:normal; line-height:24px; margin:0; text-=
align:center; word-break:normal;direction:ltr;" dir=3Dltr>Review and change=
 your privacy and security options to make <span style=3D"white-space:nowra=
p; " class=3D"">Google</span> work better <span style=3D"white-space:nowrap=
; " class=3D"">for you.</span></td>
</tr>
<tr><td height=3D30></td></tr>
<tr>
<td align=3Dcenter valign=3Dtop>
<table role=3Dpresentation>
<tr>
<td style=3D"text-align: center; padding-top: 0;">
<div>
<!--[if mso]>
<v:roundrect xmlns:v=3D"urn:schemas-microsoft-com:vml" xmlns:w=3D"urn:schem=
as-microsoft-com:office:word" href=3D"https://notifications.google.com/g/p/=
ANiao5orhPVZ5pax_hQPIm3BGKfxgtjtkuIooklUEM2CWRGcoPUeU_TQZch02bq1-W_ScInKPYh=
r8S-GmzoLBAn5gdVPF6Y6t2hrSP6UDlfL2RA3-Jlx-BGPm-g_oa6wqfPFr28ubvzI_n44kyBPEA=
CeLldk6TnKrHvPEJLRofmdGQanjTcECr4KeBSsOEJ1B-VGXk15VZlyUEVa-rlEcDYKxBtZ8Y18U=
k4Ts4wkj6WKvOpnOFG5EhlMBhHBy2DbTSD-prNlktOr9UHYSEGlEYHBncGAEXDqUJp-5GQQDH1U=
BVgzt0qJrbllCsCjVtg1CqhV8mvjXl_gimlAoN4paQ" style=3D"height:48px; v-text-an=
chor:middle; width:180px;" arcsize=3D"10%" strokecolor=3D"#1A73E8" fillcolo=
r=3D"#1A73E8;">
<w:anchorlock/>
<center style=3D"color:#ffffff;font-family:Google Sans, Roboto, Arial; font=
-size:16px; font-weight:normal; word-break:normal;direction:ltr;" dir=3D"lt=
r">Confirm</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a href=3Dhttps://notifications.google.com/g/p/ANiao5orhPVZ5pax_hQPIm3BGKfx=
gtjtkuIooklUEM2CWRGcoPUeU_TQZch02bq1-W_ScInKPYhr8S-GmzoLBAn5gdVPF6Y6t2hrSP6=
UDlfL2RA3-Jlx-BGPm-g_oa6wqfPFr28ubvzI_n44kyBPEACeLldk6TnKrHvPEJLRofmdGQanjT=
cECr4KeBSsOEJ1B-VGXk15VZlyUEVa-rlEcDYKxBtZ8Y18Uk4Ts4wkj6WKvOpnOFG5EhlMBhHBy=
2DbTSD-prNlktOr9UHYSEGlEYHBncGAEXDqUJp-5GQQDH1UBVgzt0qJrbllCsCjVtg1CqhV8mvj=
Xl_gimlAoN4paQ target=3D_blank dir=3Dltr style=3D"text-align: center; displ=
ay: inline-block;">
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0 align=3Dcenter>
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td styl=
e=3D"border-top: 3px solid #ffffff;border-top-left-radius: 4px;border-top-r=
ight-radius: 4px;display:inline-block; text-align: center;"></td></tr>
<tr><td class=3D"subheadline btn_mod4_mobile enwid" style=3D"background-col=
or:#1A73E8; border:1px solid #1A73E8; border-radius:4px; color:#ffffff; dis=
play:inline-block; font-family:Google Sans, Roboto, Arial; font-size:16px; =
line-height:25px; text-decoration:none; padding:7px 24px 7px 24px; font-wei=
ght:500; text-align: center; word-break:normal; direction:ltr; ">
Confirm
</td></tr>
<tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td styl=
e=3D"border-top: 4px solid #ffffff;display:inline-block;border-bottom-left-=
radius: 4px;border-bottom-right-radius: 4px; text-align: center;"></td></tr=
>
</table></a>
<!--<![endif]-->
</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr><td height=3D24></td></tr>
<tr>
<td width=3D480 style=3D"border: 2px solid #DFE1E5; border-radius: 8px;">
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 width=
=3D100%>
<tr>
<td style=3D"font-size:0pt; line-height:0pt; padding:0; margin:0;" width=3D=
24></td>
<!--[if mso]>
<td style=3D"margin-bottom:67px; padding: 21px 10px 35px 20px;"> <amp-img r=
ole=3D"presentation" class=3D"fa_mobile" width=3D"24" height=3D"24" src=3D"=
https://www.gstatic.com/gumdrop/files/help-outline.png" style=3D"width: 24p=
x; height:24px; text-align: center; border: none; font-size:3px;">
</td>
<![endif]-->
<!--[if !mso]><!-->
<td style=3D"padding: 47px 10px 40px 20px;" valign=3Dtop> <amp-img role=3Dp=
resentation class=3Dfa_mobile width=3D24 height=3D24 src=3Dhttps://www.gsta=
tic.com/gumdrop/files/help-outline.png style=3D"width: 24px; height:24px; t=
ext-align: center; border: none; font-size:3px;">
</td>
<!--<![endif]-->
<td valign=3Dtop>
<!--[if mso]>
<div class=3D"device_txt" style=3D"margin-bottom:15px; padding-left: 20px; =
color:#202124; font-family:Google Sans, Roboto, Arial; font-size:18px; line=
-height:28px; text-align:left; padding-top:18px; padding-bottom:12px; word-=
break:normal;direction:ltr;" dir=3D"ltr" valign=3D"top">Find answers</div>
<![endif]-->
<!--[if !mso]><!-->
<div class=3Ddevice_txt style=3D"padding-left: 20px; color:#202124; font-fa=
mily:Google Sans, Roboto, Arial; font-size:18px; line-height:28px; text-ali=
gn:left; padding-top:45px; padding-bottom:12px; word-break:normal;direction=
:ltr;" dir=3Dltr>Find answers</div>
<!--<![endif]-->
<!--[if mso]>
<div class=3D"subheadline space7" style=3D"margin-bottom:20px; padding-left=
: 20px; padding-right: 20px; color:#5F6368; font-family:Roboto, OpenSans, A=
rial, sans-serif; font-weight: normal; font-size:16px; line-height:24px; te=
xt-align:left; padding-bottom:35px; word-break:normal;direction:ltr;" dir=
=3D"ltr" valign=3D"top">Visit the <a href=3D"https://notifications.google.c=
om/g/p/ANiao5qfPNwyfs9fO6GT8DbfLNaAtatoTC3eRq8oNd6KGnQW6OR6VUDR069WcXCiHMUX=
paiupP2ccyvUvkIDWPQdRB77u6wHc6DCYv8PKDb6IdFE_rjvxFSg5Qb3ResWEsezwtPPN6mOsmh=
RjMImsZsj19dikZGyQUlIzr8NPtFe-s1CsGpW3CpjIgXWJfhZb-wObKiCaF5XLFkYT6OpSS9cLE=
hlEY32HT-c3AJaVAn2_RksAxziJYu-_wpkd8E-jxCOGZWJu32SDmJMhFmSubbuIPMDnA8YpKQGe=
2EkRnU61oJapA" target=3D"_blank" style=3D"color:#1A73E8; text-decoration: u=
nderline; font-weight:normal; border:0; white-space: nowrap; ">Help Centre<=
/a> to learn all about your new Google Account.</div>
<![endif]-->
<!--[if !mso]><!-->
<div class=3D"subheadline space7" style=3D"padding-left: 20px; padding-righ=
t: 20px; color:#5F6368; font-family:Roboto, OpenSans, Arial, sans-serif; fo=
nt-weight: normal; font-size:16px; line-height:24px; text-align:left; paddi=
ng-bottom:50px; word-break:normal;direction:ltr;" dir=3Dltr>Visit the <a hr=
ef=3Dhttps://notifications.google.com/g/p/ANiao5qfPNwyfs9fO6GT8DbfLNaAtatoT=
C3eRq8oNd6KGnQW6OR6VUDR069WcXCiHMUXpaiupP2ccyvUvkIDWPQdRB77u6wHc6DCYv8PKDb6=
IdFE_rjvxFSg5Qb3ResWEsezwtPPN6mOsmhRjMImsZsj19dikZGyQUlIzr8NPtFe-s1CsGpW3Cp=
jIgXWJfhZb-wObKiCaF5XLFkYT6OpSS9cLEhlEY32HT-c3AJaVAn2_RksAxziJYu-_wpkd8E-jx=
COGZWJu32SDmJMhFmSubbuIPMDnA8YpKQGe2EkRnU61oJapA target=3D_blank style=3D"c=
olor:#1A73E8; text-decoration: underline; font-weight:normal; border:0; whi=
te-space: nowrap; ">Help Centre</a> to learn all about your new Google Acco=
unt.</div>
<!--<![endif]-->
</td>
<td style=3D"font-size:0pt; line-height:0pt; padding:0; margin:0;" width=3D=
24></td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 align=
=3Dcenter width=3D100%>
<tr><td height=3D30></td></tr>
<tr>
<td width=3D134 height=3D46 align=3Dcenter style=3D"font-size:8px; word-bre=
ak:normal;direction:ltr;" dir=3Dltr> <amp-img role=3Dpresentation class=3Dg=
oogle_mobile width=3D82 height=3D26 src=3Dhttps://www.gstatic.com/gumdrop/f=
iles/google-logo-footer.png style=3D"width: 82px; height:26px; text-align: =
center; border: none;">
</td>
</tr>
<tr><td height=3D19></td></tr>
<tr>
<td class=3Dspace6 align=3Dcenter style=3D"color:#5F6368; font-family:&quot=
;Roboto&quot;, OpenSans, &quot;Open Sans&quot;, Arial, sans-serif; font-siz=
e:12px; line-height:18px; margin:0; text-align:center; word-break:normal;di=
rection:ltr;" dir=3Dltr>Replies to this email aren&#39;t monitored. If you =
have a question about your new account, the <a href=3Dhttps://notifications=
.google.com/g/p/ANiao5q0AH55ti4YKH5Ob5sXTDm7OXzayeoQITZN-SPn8fK7OKaSDsC7P63=
L8lM4vCTMtJmZgThTN79uwjfQBCsQ8RC1AM0Cv6apiKnyb02jY2V8Toog9r-XPKNJekp1bbvevi=
qH_VwQBpPLJ28S-fq5JI4TvtIAOQOzdIZW1neLEEzsopgnbbW-x_ntJmRmg4h4MD9a2V_txNN-S=
T9fZMLN5NX0SBEgVQtlHf1SO3g_mK-t293AVOi-vROTaocRUu3xK0kQcfeFSUc9yo7dqIXLKwj0=
Y95pOWcScXYoXkiclqn8_ERxCHeyqA target=3D_blank style=3D"color:#1A73E8; text=
-decoration: underline; font-weight:normal; border:0; white-space: nowrap; =
">Help Centre</a> probably has the answer that you&#39;re looking for.</td>
</tr>
<tr><td height=3D19></td></tr>
<tr>
<td class=3Dspace6 valign=3Dmiddle style=3D"color:#5F6368; font-family:&quo=
t;Roboto&quot;, OpenSans, &quot;Open Sans&quot;, Arial, sans-serif; font-si=
ze:10px; line-height:15px; margin:0; text-align:center" align=3Dcenter>
<span style=3D"font-size:inherit; color:inherit; font-weight:inherit; line-=
height:inherit; font-family:inherit;">Google LLC<br>1600 Amphitheatre Parkw=
ay,<br>Mountain View, CA 94043</span>
<br><br><span style=3Dword-break:normal;direction:ltr; dir=3Dltr>This email=
 was sent to you because you created a Google Account.</span></td>
</tr>
</table>
</td>
</tr>
<tr><td height=3D18></td></tr>
</table>
<div style=3D"display:none; white-space:nowrap; font:15px courier; line-hei=
ght:0;">
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=
 =C2=A0 =C2=A0 =C2=A0 =C2=A0
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0
</div>
<amp-img alt=3D"" height=3D1 width=3D3 src=3Dhttps://notifications.google.c=
om/g/img/ANiao5ob2fncbP7Zh8LCyQAMbGABlSbRlHitqLFXmmUahqAij2dAWSHT3tdYlE9udx=
3jsPojqA5-kPsZUbRiReTrpwXzoqFvjlYqtMEcIY2jRXH-ODExWklkc39IFrQLnJaYPy9pmruA9=
Hh0K8U1wQ.gif></body>
</html>
--0000000000005403e7060209280f
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

=20
<!doctype html public "- / /w3c / /dtd xhtml 1.0 transitional / /en" "http:=
 / /www.w3.org /tr /xhtml1 /dtd /xhtml1-transitional.dtd">

  <html xmlns=3Dhttp://www.w3.org/1999/xhtml xmlns:v=3Durn:schemas-microsof=
t-com:vml xmlns:o=3Durn:schemas-microsoft-com:office:office lang=3Den-GB>
    <head>
	  <title>Welcome to your Google Account</title>
      <meta name=3Dformat-detection content=3Daddress=3Dno>
      <meta name=3Dformat-detection content=3Dtelephone=3Dno>
      <meta name=3Dx-apple-disable-message-reformatting>
      <meta http-equiv=3DContent-Type content=3D"text/html; charset=3Dutf-8=
">
      <meta name=3Dviewport content=3D"width=3Ddevice-width, initial-scale=
=3D1, maximum-scale=3D1">
      <link href=3D//fonts.googleapis.com/css?family=3DGoogle+Sans rel=3Dst=
ylesheet type=3Dtext/css>
      <style type=3Dtext/css>
      body{text-decoration:none;}
      </style>
      <style type=3Dtext/css>
           @media only screen and (max-width: 767px){
             .body_wrapper{min-width:540px !important;}
             .body_size{width: 100% !important;}
             .subheadline{font-size:22px!important;line-height: 35px !impor=
tant;}
             .device_txt{font-size:26px!important;}
             .google_mobile{width:135px !important; height:43px !important;=
}
             .bulb_mobile{width:22px !important; height:31px !important;pad=
ding-top:20px !important;}
             .shield_mobile{width:24px !important; height:31px !important;}
             .fmd_mobile{width:30px !important; height:24px !important;}
             .fa_mobile{width:30px !important; height:30px !important;}
             .arm4_img_height{height: 60px !important; width: 190px !import=
ant;}

             .btn_mod2_mobile1{padding:9px 24px 11px 24px !important; borde=
r-radius: 4px !important;}
             .btn_mod2_mobile2{padding:9px 24px 11px 24px !important; borde=
r-radius: 4px !important;}
            =20
             .btn_mod3_mobile{padding:9px 24px 11px 24px !important; border=
-radius: 4px !important;}
             .btn_mod4_mobile{padding:9px 24px 11px 24px !important; border=
-radius: 4px !important;}

             .space1{height:19px !important;}
             .space2{padding:3px 35px 0 35px !important;}
             .space3{padding-top: 22px !important;}
             .space4{padding: 6px 0 0 0 !important;}
             .space5{padding-top: 17px !important;}
             .space6{padding:0 35px 0 35px !important;}
             .space7{padding-right: 10px !important;}
             .enwid{min-width: 218px !important;}
             .enwid2{min-width: 176px !important;}
           }

           @media screen and (min-resolution: 288dpi) {
             .device_txt{font-size:26px!important;}
           }
       </style>
      <style>
        @font-face {
          font-family: Noto Naskh Arabic;
          font-style: normal;
          font-weight: 400;
          src: url(https://fonts.gstatic.com/ea/notonaskharabic/v4/NotoNask=
hArabic-Regular.eot);
          src: url(https://fonts.gstatic.com/ea/notonaskharabic/v4/NotoNask=
hArabic-Regular.eot?#iefix) format('embedded-opentype'),
               url(https://fonts.gstatic.com/ea/notonaskharabic/v4/NotoNask=
hArabic-Regular.woff2) format('woff2'),
               url(https://fonts.gstatic.com/ea/notonaskharabic/v4/NotoNask=
hArabic-Regular.woff) format('woff'),
               url(https://fonts.gstatic.com/ea/notonaskharabic/v4/NotoNask=
hArabic-Regular.ttf) format('truetype');
        }
		</style>
      <style>
    :root {
    color-scheme: light dark;
    supported-color-schemes: light dark;
  }
    @media (prefers-color-scheme: dark ) {
  /* Custom Dark Mode Font Colors */
  td, span, h1, h2, h3, h4, h5, h6, h7, p, div {
    color: #ffffff !important;}
      div, table, td { background-color: transparent !important;  }
      body { background-color: #3C4043 !important; }
      a {color: #1A73E8 !important;}
      .body_wrapper {background-color: #3C4043 !important; }
    }
  	</style>

    <!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
<!--[if mso]>
 <style>a{color:4285f4 !important; text-decoration:none !important;}</style=
>
<![endif]-->
<style>
    :root {
    color-scheme: light dark;
    supported-color-schemes: light dark;
  }
    @media (prefers-color-scheme: dark ) {
  /* Custom Dark Mode Font Colors */
  td, span, h1, h2, h3, h4, h5, h6, h7, p, div {
    color: #ffffff !important;}
      div, table, td { background-color: transparent !important;  }
      body { background-color: #3C4043 !important; }
      a {color: #1A73E8 !important;}
      .bgc {background-color: #3C4043 !important; }
    }
</style>
    </head>
       =20
      =20
     =20
     =20
   =20
   =20
         =20
         =20
         =20







<body bgcolor=3D#ffffff class=3Dbody_wrapper>
      <style>
          @media screen{@font-face{font-family:'Open Sans';font-style:norma=
l;font-weight:normal;src:local('Open Sans Light'),local('OpenSans-Light'),u=
rl(http://fonts.gstatic.com/s/opensans/v9/DXI1ORHCpsQm3Vp6mXoaTRampu5_7CjHW=
5spxoeN3Vs.woff2) format('woff2'),url(http://fonts.gstatic.com/s/opensans/v=
9/DXI1ORHCpsQm3Vp6mXoaTaRDOzjiPcYnFooOUGCOsRk.woff) format('woff')}}
          /*body{padding:0;margin:0}@media only screen and (max-width:520px=
){-webkit-text-size-adjust:100%}*/
          body{text-decoration:none;}
      </style>
  <div style=3D"font-size: 0px; line-height:0px; color: #ffffff; display: n=
one;">=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=
 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=
=C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=
 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =
=C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =
=C2=A0=C2=A0 =C2=A0 </div>
      <center>
        <table role=3Dpresentation class=3Dbody_size border=3D0 cellspacing=
=3D0 cellpadding=3D0 align=3Dcenter width=3D520 bgcolor=3D#ffffff style=3D"=
background: #ffffff; min-width: 520px; -webkit-font-smoothing: antialiased;=
 -webkit-text-size-adjust: none; -ms-text-size-adjust: 100%;">
          <tr><td align=3Dcenter style=3D"padding-top: 20px;">  <img role=
=3Dpresentation class=3Dgoogle_mobile width=3D82 height=3D26 border=3D0 src=
=3Dhttps://www.gstatic.com/gumdrop/files/google-logo-header.png style=3D"wi=
dth: 82px; height:26px; text-align: center; border: none;">
</td></tr>
          <tr><td class=3Dspace1 height=3D15></td></tr>
          <tr>
            <td width=3D480 style=3D"-webkit-font-smoothing: antialiased; -=
webkit-text-size-adjust: none; -ms-text-size-adjust: 100%; border: 2px soli=
d #DFE1E5; border-radius: 8px;">
              <table role=3Dpresentation border=3D0 cellspacing=3D0 cellpad=
ding=3D0 width=3D100%>
                <tr>
                  <td align=3Dcenter>      		<img role=3Dpresentation class=
=3Dtop_img width=3D516 border=3D0 src=3Dhttps://www.gstatic.com/gumdrop/fil=
es/banner.png style=3D"width: 100%; text-align: center; border: none;">
    </a>
</td>
                </tr>
                <tr>
                  <td>
  				    <table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=
=3D0 align=3Dcenter width=3D100%>
                      <tr>
                        <!--[if mso]>
                        <td align=3D"center" class=3D"greeting_name space6"=
 style=3D'color:#202124; font-family:Google Sans, "Roboto", Arial; font-siz=
e:28px; font-weight:normal; line-height:44px; margin:0; padding:0 80px 20px=
 80px; text-align:center;word-break:normal;direction:ltr;' dir=3D"ltr">
             Hi Royale,
</td>
                        <![endif]-->
                        <!--[if !mso]><!-->
                        <td align=3Dcenter class=3D"greeting_name space6" s=
tyle=3D"color:#202124; font-family:Google Sans, &quot;Roboto&quot;, Arial; =
font-size:28px; font-weight:normal; line-height:44px; margin:0; padding:0 8=
0px 0 80px; text-align:center; word-break:normal;direction:ltr;" dir=3Dltr>
             Hi Royale,
         </td>
                        <!--<![endif]-->
                      </tr>
                      <!--[if !mso]><!-->
                      <tr>
                        <td height=3D15 style=3D"line-height: 4px; font-siz=
e: 4px;"></td>
                      </tr>
                      <!--<![endif]-->
                      <tr>
                        <td class=3D"subheadline space2" align=3Dcenter sty=
le=3D"color:#3C4043; font-family:&quot;Roboto&quot;, OpenSans, &quot;Open S=
ans&quot;, Arial, sans-serif; font-size:16px; font-weight:normal; line-heig=
ht:24px; margin:0; padding:0 70px 0 70px; text-align:center; word-break:nor=
mal;direction:ltr;" dir=3Dltr> Welcome to Google. Your new account comes wi=
th access to Google products, apps and services.</td>
                      </tr>
                      <tr>
                        <td class=3D"subheadline space6" align=3Dcenter sty=
le=3D"color:#3C4043; font-family:&quot;Roboto&quot;, OpenSans, &quot;Open S=
ans&quot;, Arial, sans-serif; font-size:16px; font-weight:normal; line-heig=
ht:24px; margin:0; padding:0 80px 0 80px; text-align:center; word-break:nor=
mal;direction:ltr;" dir=3Dltr> Here are a few tips to get you started.</td>
                      </tr>
                      <tr><td height=3D45></td></tr>
                    </table>
				  </td>
                </tr>
              </table>
		    </td>
          </tr>
          <tr><td height=3D24></td></tr>
          <tr>
            <td width=3D480 style=3D"-webkit-font-smoothing: antialiased; -=
webkit-text-size-adjust: none; -ms-text-size-adjust: 100%; border: 2px soli=
d #DFE1E5; border-radius: 8px;">
              <table role=3Dpresentation border=3D0 cellspacing=3D0 cellpad=
ding=3D0 width=3D100%>
          <tr>
<td>
<table role=3Dpresentation border=3D0 cellspacing=3D0 cellpadding=3D0 width=
=3D100%>
         <tr>
                  <td>
                    <table role=3Dpresentation border=3D0 cellspacing=3D0 c=
ellpadding=3D0 align=3Dcenter width=3D100%>
                      <tr><td height=3D50></td></tr>
                      <tr>
                        <td align=3Dcenter>  <img role=3Dpresentation class=
=3Dmodule_mobile width=3D48 height=3D48 border=3D0 src=3Dhttps://www.gstati=
c.com/images/branding/product/2x/email_64dp.png style=3D"width: 48px; heigh=
t:48px; text-align: center; border: none; font-size:9px;">
</td>
                      </tr>
                 =20
                      <tr><td height=3D15></td></tr>
                      <tr>
                       =20
                        <!--[if mso]>
                        <td align=3D"center" class=3D"device_txt space6" st=
yle=3D'color:#202124; font-family:Google Sans, Roboto, Arial; font-size:18p=
x; font-weight:normal; line-height:33px; margin:0; padding:0 80px 20px 80px=
; text-align:center; word-break:normal;direction:ltr;' dir=3D"ltr">Get the =
most out of your Google Account</td>
                        <![endif]-->
                        <!--[if !mso]><!-->
                        <td align=3Dcenter class=3D"device_txt space6" styl=
e=3D"color:#202124; font-family:Google Sans, Roboto, Arial; font-size:18px;=
 font-weight:normal; line-height:33px; margin:0; padding:0 80px 0 80px; tex=
t-align:center; word-break:normal;direction:ltr;" dir=3Dltr>Get the most ou=
t of your Google Account</td>
                        <!--<![endif]-->
                       =20
                      </tr>
                      <!--[if !mso]><!-->
                      <tr>
                  <td height=3D15 style=3D"line-height: 4px; font-size: 4px=
;"></td>
                      </tr>
                      <!--<![endif]-->
                      <tr>
                          <td class=3D"subheadline space6" align=3Dcenter s=
tyle=3D"color:#5F6368; font-family:Roboto, OpenSans, Open Sans, Arial, sans=
-serif; font-size:16px; font-weight:normal; line-height:24px; margin:0; pad=
ding:0 80px 0 80px; text-align:center; word-break:normal;direction:ltr;" di=
r=3Dltr>We&#39;ll send you personalised tips, news and recommendations from=
 Google.</td>
                      </tr>
                =20
                      <tr><td height=3D30></td></tr>
                      <tr>
                          <td class=3Dspace4 style=3D"text-align: center; p=
adding: 0;">
                             <div>
                				<!--[if mso]>
                                	<v:roundrect xmlns:v=3D"urn:schemas-micros=
oft-com:vml" xmlns:w=3D"urn:schemas-microsoft-com:office:word" href=3D"http=
s://notifications.google.com/g/p/ANiao5rDo2pWzrVzo0NyGWsr1oYP48opYnBqAYOFwM=
WcEKYbTDYDtGOWU7gF1oyT_BIxnKoRDmL29HCsGhvJBfkH8Xd3CjIGuNhEQSS2zFPXy4xAAtKWY=
YhGTeusH7fWmzWZpR0nkk6yuy8Y8M6tLQuvrPkz5_cl6-6PQU8BhISePTIBlTh0iFCk9UyZMP1S=
5LCZdGnARcbYkARVYUxm__474mpuDSTGxktheBzhFYF50Rv1J3V9rT7SUWqveWKOLy179h7J8zU=
1kOk3ZTrIm_7LvbDIQ3bES2B3k1qW2wuVUIebf3vNTPdvjJkvpwkwX6ZAm7EIFJRaC3RnSLGfHs=
_q78TGeI38ucIgLp4iqENjOmDbCJuKK3m0DNblcI6v5U4uXTrXVVktT0f5rvd_E_ljzhFbBroyS=
57ZmmJjoExaBF11ETWMbowq8Ph8FUbJp6kmk0X-l5SOt2Pq4GMfSvYWHOVPm0RGEDcqrr00ssAi=
kvKQYAKrtlJKXjJwZRZhmrbAuo3kXJCtUsnxyMUfHUEe-QmIjGIQtXURxnU--JRH9frFlkAXjxh=
mTILeDimWnCTs9bBPAoox9L8EHIELWUkdHptwemLyIFybmQWsih5zZe0" style=3D"height:4=
8px; v-text-anchor:middle; width:180px; " line-height: 22px; arcsize=3D"10%=
" strokecolor=3D"#1A73E8" fillcolor=3D"#1A73E8;">
									<w:anchorlock/>
                                    <center style=3D"color:#ffffff;font-fam=
ily:Google Sans, Roboto, Arial; font-size:16px; font-weight:normal; word-br=
eak:normal; line-height: 22px; mso-line-height-rule: exactly; direction:ltr=
;" dir=3D"ltr">Yes, keep me updated</center>
                                    </v:roundrect>
                                <![endif]-->
                              =20
                               <!--[if !mso]><!-->
                               <a href=3Dhttps://notifications.google.com/g=
/p/ANiao5rDo2pWzrVzo0NyGWsr1oYP48opYnBqAYOFwMWcEKYbTDYDtGOWU7gF1oyT_BIxnKoR=
DmL29HCsGhvJBfkH8Xd3CjIGuNhEQSS2zFPXy4xAAtKWYYhGTeusH7fWmzWZpR0nkk6yuy8Y8M6=
tLQuvrPkz5_cl6-6PQU8BhISePTIBlTh0iFCk9UyZMP1S5LCZdGnARcbYkARVYUxm__474mpuDS=
TGxktheBzhFYF50Rv1J3V9rT7SUWqveWKOLy179h7J8zU1kOk3ZTrIm_7LvbDIQ3bES2B3k1qW2=
wuVUIebf3vNTPdvjJkvpwkwX6ZAm7EIFJRaC3RnSLGfHs_q78TGeI38ucIgLp4iqENjOmDbCJuK=
K3m0DNblcI6v5U4uXTrXVVktT0f5rvd_E_ljzhFbBroyS57ZmmJjoExaBF11ETWMbowq8Ph8FUb=
Jp6kmk0X-l5SOt2Pq4GMfSvYWHOVPm0RGEDcqrr00ssAikvKQYAKrtlJKXjJwZRZhmrbAuo3kXJ=
CtUsnxyMUfHUEe-QmIjGIQtXURxnU--JRH9frFlkAXjxhmTILeDimWnCTs9bBPAoox9L8EHIELW=
UkdHptwemLyIFybmQWsih5zZe0 target=3D_blank dir=3Dltr style=3D"text-align: c=
enter; display: inline-block;">
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0 align=3Dcenter>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 4px; border-top-left-radius: 4px;border-top-right-radi=
us: 4px;display:inline-block; -webkit-text-size-adjust:none;mso-hide:all;te=
xt-align: center;"></td></tr>
        <tr><td class=3D"subheadline btn_mod2_mobile2 enwid enwid3" style=
=3D"background-color:#1A73E8;; border:1px solid #1A73E8; border-radius:4px;=
 color:#ffffff; display:inline-block; font-family:Google Sans, Roboto, Aria=
l; font-size:16px; line-height:25px; text-decoration:none;  padding:7px 24p=
x 7px 24px; -webkit-text-size-adjust:none; mso-hide:all; font-weight:500; t=
ext-align: center; word-break:normal;  direction:ltr; min-width: 159px;">
Yes, keep me updated
</td></tr>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 3px; display:inline-block;border-bottom-left-radius: 4=
px;border-bottom-right-radius: 4px; -webkit-text-size-adjust:none;mso-hide:=
all;text-align: center;"></td></tr>
</table></a>
                               <!--<![endif]-->
                              =20
                             </div>
                          </td>
                      </tr>

                 <tr><td height=3D50></td></tr>
                    </table>
                  </td>
                </tr>

</table>
</td>
</tr>
              </table>
		    </td>
          </tr>
          <tr><td height=3D24></td></tr>
          <tr>
            <td width=3D480 style=3D"-webkit-font-smoothing: antialiased; -=
webkit-text-size-adjust: none; -ms-text-size-adjust: 100%; border: 2px soli=
d #DFE1E5; border-radius: 8px;">
              <table role=3Dpresentation border=3D0 cellspacing=3D0 cellpad=
ding=3D0 width=3D100%>
              <tr>
                  <td>
                    <table role=3Dpresentation border=3D0 cellspacing=3D0 c=
ellpadding=3D0 align=3Dcenter width=3D100%>
                      <tr><td height=3D50></td></tr>
                      <tr>
                        <td align=3Dcenter>    <img role=3Dpresentation cla=
ss=3Dmodule_mobile width=3D48 height=3D48 border=3D0 src=3Dhttps://www.gsta=
tic.com/gumdrop/files/google-logo.png style=3D"width: 48px; height:48px; te=
xt-align: center; border: none; font-size:9px;">
</td>
                      </tr>
                 =20
                      <tr><td height=3D15></td></tr>
                      <tr>
                       =20
                        <!--[if mso]>
                        <td align=3D"center" class=3D"device_txt space6" st=
yle=3D'color:#202124; font-family:Google Sans, "Roboto", Arial; font-size:1=
8px; font-weight:normal; line-height:33px; margin:0; padding:0 80px 20px 80=
px; text-align:center; word-break:normal;direction:ltr;' dir=3D"ltr">Stay u=
p to date with the <span style=3D"white-space:nowrap; " class=3D"">Google a=
pp</span></td>
                        <![endif]-->
                        <!--[if !mso]><!-->
                        <td align=3Dcenter class=3D"device_txt space6" styl=
e=3D"color:#202124; font-family:Google Sans, &quot;Roboto&quot;, Arial; fon=
t-size:18px; font-weight:normal; line-height:33px; margin:0; padding:0 80px=
 0 80px; text-align:center; word-break:normal;direction:ltr;" dir=3Dltr>Sta=
y up to date with the <span style=3D"white-space:nowrap; " class=3D"">Googl=
e app</span></td>
                        <!--<![endif]-->
                       =20
                      </tr>
                      <!--[if !mso]><!-->
                      <tr>
                        <td height=3D15 style=3D"line-height: 4px; font-siz=
e: 4px;"></td>
                      </tr>
                      <!--<![endif]-->
                      <tr>
                        =20
                          <td class=3D"subheadline space6" align=3Dcenter s=
tyle=3D"color:#5F6368; font-family:&quot;Roboto&quot;, OpenSans, &quot;Open=
 Sans&quot;, Arial, sans-serif; font-size:16px; font-weight:normal; line-he=
ight:24px; margin:0; padding:0 80px 0 80px; text-align:center; word-break:n=
ormal;direction:ltr;" dir=3Dltr>Find quick answers, explore your interests =
and stay up to date.</td>
                         =20
                      </tr>
                      <tr><td height=3D30></td></tr>
                      <tr>
                          <td class=3Dspace4 style=3D"text-align: center; p=
adding: 0;">
                             <div>
                				<!--[if mso]>
                                	<v:roundrect xmlns:v=3D"urn:schemas-micros=
oft-com:vml" xmlns:w=3D"urn:schemas-microsoft-com:office:word" href=3D"http=
s://notifications.google.com/g/p/ANiao5qJuhiyHHvjguTupxeyj3yPvDmDEWjgbEtmPJ=
p6upu-OwSdwMozaIX8MBNMVD0uubqwifTrfViEqJp4fTj-AUQUC_SCRJrjDgZdPjsLA7eWqSsVq=
zW-OoOOM2GBE_elwuSxYD8VLYY1iCTxrzXFAEb33oanCDeXwu5Ey0ug7AcRyLj8ypCvEQe1asH0=
sdOa0fjKyF-zGWEMFjlJkA3UXrNKJDs_XIcMsUNyR7Y3BmUXD-tGEyPGPRLIPDM7PXCS76ByP8h=
CTc1IvVLnC9WwBMACu5XHCXLF13wK9DQbAlVxNT1FloXbdoq2CbbhPpVkRxde8kpOxMgQdUxXPu=
IQZEx-uhqZ1aadtWC_VggcNyua8zr5Rca5gY0" style=3D"height:48px; v-text-anchor:=
middle; width:188px;" arcsize=3D"10%" strokecolor=3D"#1A73E8" fillcolor=3D"=
#1A73E8;">
									<w:anchorlock/>
                                    <center style=3D"color:#ffffff;font-fam=
ily:Google Sans, Roboto, Arial; font-size:16px; font-weight:normal; word-br=
eak:normal;direction:ltr;" dir=3D"ltr">Try it</center>
                                    </v:roundrect>
                                <![endif]-->
                              =20
                               <!--[if !mso]><!-->
                               <a href=3Dhttps://notifications.google.com/g=
/p/ANiao5qJuhiyHHvjguTupxeyj3yPvDmDEWjgbEtmPJp6upu-OwSdwMozaIX8MBNMVD0uubqw=
ifTrfViEqJp4fTj-AUQUC_SCRJrjDgZdPjsLA7eWqSsVqzW-OoOOM2GBE_elwuSxYD8VLYY1iCT=
xrzXFAEb33oanCDeXwu5Ey0ug7AcRyLj8ypCvEQe1asH0sdOa0fjKyF-zGWEMFjlJkA3UXrNKJD=
s_XIcMsUNyR7Y3BmUXD-tGEyPGPRLIPDM7PXCS76ByP8hCTc1IvVLnC9WwBMACu5XHCXLF13wK9=
DQbAlVxNT1FloXbdoq2CbbhPpVkRxde8kpOxMgQdUxXPuIQZEx-uhqZ1aadtWC_VggcNyua8zr5=
Rca5gY0 target=3D_blank dir=3Dltr style=3D"text-align: center; display: inl=
ine-block;">
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0 align=3Dcenter>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 4px; border-top-left-radius: 4px;border-top-right-radi=
us: 4px;display:inline-block; -webkit-text-size-adjust:none;mso-hide:all;te=
xt-align: center;"></td></tr>
        <tr><td class=3D"subheadline btn_mod2_mobile2 enwid" style=3D"backg=
round-color:#1A73E8;; border:1px solid #1A73E8; border-radius:4px; color:#f=
fffff; display:inline-block; font-family:Google Sans, Roboto, Arial; font-s=
ize:16px; line-height:25px; text-decoration:none;  padding:7px 24px 7px 24p=
x; -webkit-text-size-adjust:none; mso-hide:all; font-weight:500; text-align=
: center; word-break:normal;  direction:ltr; min-width: 159px;">
Try it
</td></tr>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 3px; display:inline-block;border-bottom-left-radius: 4=
px;border-bottom-right-radius: 4px; -webkit-text-size-adjust:none;mso-hide:=
all;text-align: center;"></td></tr>
</table></a>
                               <!--<![endif]-->
                              =20
                             </div>
                          </td>
                      </tr>

                      <tr><td height=3D50></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
		     </td>
          </tr>

          <tr><td height=3D24></td></tr>
          <tr>
                  <td width=3D480 style=3D"-webkit-font-smoothing: antialia=
sed; -webkit-text-size-adjust: none; -ms-text-size-adjust: 100%; border: 2p=
x solid #DFE1E5; border-radius: 8px;">
                    <table role=3Dpresentation border=3D0 cellspacing=3D0 c=
ellpadding=3D0 align=3Dcenter width=3D100%>
                      <tr>
                  <td align=3Dcenter>  	<img role=3Dpresentation class=3Dto=
p_img width=3D514 border=3D0 src=3Dhttps://www.gstatic.com/gumdrop/files/ap=
ps-icons-image-2x-wd972px-ht390px.png style=3D"width: 100%; text-align: cen=
ter; border: none; border-top-left-radius: 8px; border-top-right-radius: 8p=
x;">

				</td>
                </tr>

                      <tr><td height=3D15></td></tr>
                      <tr>

                        <!--[if mso]>
                        <td align=3D"center" class=3D"device_txt space6" st=
yle=3D'color:#202124; font-family:Google Sans, "Roboto", Arial; font-size:1=
8px; font-weight:normal; line-height:33px; margin:0; padding:0 80px 20px 80=
px; text-align:center; word-break:normal;direction:ltr;' dir=3D"ltr">More f=
rom Google</td>
                        <![endif]-->
                        <!--[if !mso]><!-->
                        <td align=3Dcenter class=3D"device_txt space6" styl=
e=3D"color:#202124; font-family:Google Sans, &quot;Roboto&quot;, Arial; fon=
t-size:18px; font-weight:normal; line-height:33px; margin:0; padding:0 80px=
 0 80px; text-align:center; word-break:normal;direction:ltr;" dir=3Dltr>Mor=
e from Google</td>
                        <!--<![endif]-->
                      </tr>
                      <!--[if !mso]><!-->
                      <tr>
                        <td height=3D15 style=3D"line-height: 4px; font-siz=
e: 4px;"></td>
                      </tr>
                      <!--<![endif]-->
                      <tr>
                          <td class=3D"subheadline space6" align=3Dcenter s=
tyle=3D"color:#5F6368; font-family:&quot;Roboto&quot;, OpenSans, &quot;Open=
 Sans&quot;, Arial, sans-serif; font-size:16px; font-weight:normal; line-he=
ight:24px; margin:0; padding:0 80px 0 80px; text-align:center; word-break:n=
ormal;direction:ltr;" dir=3Dltr>Discover the latest apps from Google.</td>
                      </tr>
                      <tr><td height=3D30></td></tr>
                      <tr>
                          <td align=3Dcenter valign=3Dtop>
                              <table role=3Dpresentation>
                                  <tr>
                                      <td style=3D"text-align: center; padd=
ing-top: 0;">
                                          <div>
                                            <!--[if mso]>
                                              <v:roundrect xmlns:v=3D"urn:s=
chemas-microsoft-com:vml" xmlns:w=3D"urn:schemas-microsoft-com:office:word"=
 href=3D"https://notifications.google.com/g/p/ANiao5qUqD9zMbGDEpYm1faYNNn88=
NuvyNM2Ojg5vWb1vwHDc2N7UwkvHaR4631P5KhdHrWbwXr9nfkvmdPxTFc7fC7Yey4vvGBk7ZSG=
26HhbCvJZIsmK_pfWYidOad51h1lP_-wU18-X6G4YhW_F-j7YLt6kBqi7SxN4L-WcEQHItGhBAQ=
YgYN-hoDIGaKE75hn22SvmuhvTnaQGd1oAQ4LBIMTnP7DbNVXFbI7SxBGk_k3E2c_epyXYmhJ31=
NNWD6uQlYFycNnm2JUBIqSz0afDCHttlirqxqATWB2J9OGQhnmOCHRJrwqBz2kZzY9FUgspZNUV=
-xh99Uvj6q5FqwKeUr3p66p8NExeEHU_FtacoEKILljIzH8h19ArWUQphc3TOYqHvTIr6KySNQt=
OMSDeQ90tsKI7I8U5jVua7QGzQ2fjgNgCDMOiZZuRJqhdihmsJq-FZeAYAHQoqMHFA4ELkctCWM=
9USEnSC4FBrsvND-cvwxWy8-bfwq0D-TgMvdqcgxt36djQv7vMchkmFXGThlATX2BuStj70teVu=
vSip64ylF9wWv3opXyWLnlXueAlp8EjwxLUGs40ky3yBa-3zLApKu5Sv61C7SJh0sM4kaSjDuol=
9_lnmd6gVMMbcEyzI3BmuQgDp1atPfp1ES3s1OJ" style=3D"height:48px; v-text-ancho=
r:middle; width:188;" arcsize=3D"10%" strokecolor=3D"#1A73E8" fillcolor=3D"=
#1A73E8;">
                                              <w:anchorlock/>
                                              <center style=3D"color:#fffff=
f;font-family:Google Sans, Roboto, Arial; font-size:16px; font-weight:norma=
l; word-break:normal;direction:ltr;" dir=3D"ltr">For Android</center>
                                              </v:roundrect>
                                            <![endif]-->
                                           =20
                                            <!--[if !mso]><!-->
                               <a href=3Dhttps://notifications.google.com/g=
/p/ANiao5qUqD9zMbGDEpYm1faYNNn88NuvyNM2Ojg5vWb1vwHDc2N7UwkvHaR4631P5KhdHrWb=
wXr9nfkvmdPxTFc7fC7Yey4vvGBk7ZSG26HhbCvJZIsmK_pfWYidOad51h1lP_-wU18-X6G4YhW=
_F-j7YLt6kBqi7SxN4L-WcEQHItGhBAQYgYN-hoDIGaKE75hn22SvmuhvTnaQGd1oAQ4LBIMTnP=
7DbNVXFbI7SxBGk_k3E2c_epyXYmhJ31NNWD6uQlYFycNnm2JUBIqSz0afDCHttlirqxqATWB2J=
9OGQhnmOCHRJrwqBz2kZzY9FUgspZNUV-xh99Uvj6q5FqwKeUr3p66p8NExeEHU_FtacoEKILlj=
IzH8h19ArWUQphc3TOYqHvTIr6KySNQtOMSDeQ90tsKI7I8U5jVua7QGzQ2fjgNgCDMOiZZuRJq=
hdihmsJq-FZeAYAHQoqMHFA4ELkctCWM9USEnSC4FBrsvND-cvwxWy8-bfwq0D-TgMvdqcgxt36=
djQv7vMchkmFXGThlATX2BuStj70teVuvSip64ylF9wWv3opXyWLnlXueAlp8EjwxLUGs40ky3y=
Ba-3zLApKu5Sv61C7SJh0sM4kaSjDuol9_lnmd6gVMMbcEyzI3BmuQgDp1atPfp1ES3s1OJ tar=
get=3D_blank dir=3Dltr style=3D"text-align: center; display: inline-block;"=
>
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0 align=3Dcenter>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 4px; border-top-left-radius: 4px;border-top-right-radi=
us: 4px;display:inline-block; -webkit-text-size-adjust:none;mso-hide:all;te=
xt-align: center;"></td></tr>
        <tr><td class=3D"subheadline btn_mod3_mobile enwid2" style=3D"backg=
round-color:#1A73E8;; border:1px solid #1A73E8; border-radius:4px; color:#f=
fffff; display:inline-block; font-family:Google Sans, Roboto, Arial; font-s=
ize:16px; line-height:25px; text-decoration:none;  padding:7px 24px 7px 24p=
x; -webkit-text-size-adjust:none; mso-hide:all; font-weight:500; text-align=
: center; word-break:normal;  direction:ltr; min-width: 128px;">
For Android
</td></tr>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 3px; display:inline-block;border-bottom-left-radius: 4=
px;border-bottom-right-radius: 4px; -webkit-text-size-adjust:none;mso-hide:=
all;text-align: center;"></td></tr>
</table></a>
                               <!--<![endif]-->
                                          =20

                        <span width=3D40 style=3Dwidth:40px; class=3Dwidmin=
space>=C2=A0=C2=A0</span>
                                            <!--[if mso]>
                                              <v:roundrect xmlns:v=3D"urn:s=
chemas-microsoft-com:vml" xmlns:w=3D"urn:schemas-microsoft-com:office:word"=
 href=3D"https://notifications.google.com/g/p/ANiao5p66KWm_xOD_0YsgROmctokQ=
yWKB6cLEY6V22cHfnCpqUPZlAqKwy2yaB21mxh9SRkkZe9W0SXp4KZwIg8YcrgBQir8tgdo0VEY=
jcHrAMl4_8VzjaKghY3GO4wsbvJdoAXKK2fkue3FfiPwRJPQIiaxIkgb798HNmFekh_4SpvmIu-=
8Gwxq9V1biMZVy2Ralut5Qw4WsrcM2l-so3d3BJZhaOxSl8NTE3VfVu7aU3Oo51YoGCaOqTa8hv=
p2ERV9AYw0C0IsBmf9puVye_4UvyUywffku5I2SfPDeOG5UIH5RFrTK5W4jGzidCyugXRw4_TkA=
zcdBPxPqjVudNqPGePFJGNO2WdRFX7y1_ylpd-LC_8pg9ZeSI0XNY_RUtAUN9MVxn34e-Q" sty=
le=3D"height:48px; v-text-anchor:middle; width:188;" arcsize=3D"10%" stroke=
color=3D"#1A73E8" fillcolor=3D"#1A73E8;">
                                              <w:anchorlock/>
                                              <center style=3D"color:#fffff=
f;font-family:Google Sans, Roboto, Arial; font-size:16px; font-weight:norma=
l; word-break:normal;direction:ltr;" dir=3D"ltr">For iOS</center>
                                              </v:roundrect>
                                            <![endif]-->
                                           =20
                                            <!--[if !mso]><!-->
                               <a href=3Dhttps://notifications.google.com/g=
/p/ANiao5p66KWm_xOD_0YsgROmctokQyWKB6cLEY6V22cHfnCpqUPZlAqKwy2yaB21mxh9SRkk=
Ze9W0SXp4KZwIg8YcrgBQir8tgdo0VEYjcHrAMl4_8VzjaKghY3GO4wsbvJdoAXKK2fkue3FfiP=
wRJPQIiaxIkgb798HNmFekh_4SpvmIu-8Gwxq9V1biMZVy2Ralut5Qw4WsrcM2l-so3d3BJZhaO=
xSl8NTE3VfVu7aU3Oo51YoGCaOqTa8hvp2ERV9AYw0C0IsBmf9puVye_4UvyUywffku5I2SfPDe=
OG5UIH5RFrTK5W4jGzidCyugXRw4_TkAzcdBPxPqjVudNqPGePFJGNO2WdRFX7y1_ylpd-LC_8p=
g9ZeSI0XNY_RUtAUN9MVxn34e-Q target=3D_blank dir=3Dltr style=3D"text-align: =
center; display: inline-block;">
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0 align=3Dcenter>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 4px; border-top-left-radius: 4px;border-top-right-radi=
us: 4px;display:inline-block; -webkit-text-size-adjust:none;mso-hide:all;te=
xt-align: center;"></td></tr>
        <tr><td class=3D"subheadline btn_mod3_mobile enwid2 widmin" style=
=3D"background-color:#1A73E8;; border:1px solid #1A73E8; border-radius:4px;=
 color:#ffffff; display:inline-block; font-family:Google Sans, Roboto, Aria=
l; font-size:16px; line-height:25px; text-decoration:none;  padding:7px 24p=
x 7px 24px; -webkit-text-size-adjust:none; mso-hide:all; font-weight:500; t=
ext-align: center; word-break:normal;  direction:ltr; min-width: 128px;">
For iOS
</td></tr>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 3px; display:inline-block;border-bottom-left-radius: 4=
px;border-bottom-right-radius: 4px; -webkit-text-size-adjust:none;mso-hide:=
all;text-align: center;"></td></tr>
</table></a>
                               <!--<![endif]-->
                                          =20
                                          </div>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr><td height=3D50></td></tr>
                    </table>
                  </td>
                </tr>

              <tr><td height=3D24></td></tr>
                <tr>
                  <td width=3D480 style=3D"-webkit-font-smoothing: antialia=
sed; -webkit-text-size-adjust: none; -ms-text-size-adjust: 100%; border: 2p=
x solid #DFE1E5; border-radius: 8px;">
                    <table role=3Dpresentation border=3D0 cellspacing=3D0 c=
ellpadding=3D0 align=3Dcenter width=3D100%>
                      <tr><td height=3D40></td></tr>
                      <tr>
                        <td align=3Dcenter>    <img role=3Dpresentation cla=
ss=3Dmodule_mobile width=3D48 height=3D48 border=3D0 src=3Dhttps://www.gsta=
tic.com/gumdrop/files/security-logo.png style=3D"width: 48px; height:48px; =
text-align: center; border: none;">
</td>
                      </tr>
                      <tr><td height=3D15></td></tr>
                      <tr>
                        <!--[if mso]>
                        <td align=3D"center" class=3D"device_txt space6" st=
yle=3D'color:#202124; font-family:Google Sans, "Roboto", Arial; font-size:1=
8px; font-weight:normal; line-height:33px; margin:0; padding:0 80px 20px 80=
px; text-align:center; word-break:normal;direction:ltr;' dir=3D"ltr">Confir=
m that your options are right <span style=3D"white-space:nowrap; " class=3D=
"">for you</span></td>
                        <![endif]-->
                        <!--[if !mso]><!-->
                        <td align=3Dcenter class=3D"device_txt space6" styl=
e=3D"color:#202124; font-family:Google Sans, &quot;Roboto&quot;, Arial; fon=
t-size:18px; font-weight:normal; line-height:33px; margin:0; padding:0 80px=
 0 80px; text-align:center; word-break:normal;direction:ltr;" dir=3Dltr>Con=
firm that your options are right <span style=3D"white-space:nowrap; " class=
=3D"">for you</span></td>
                        <!--<![endif]-->
                      </tr>
                      <!--[if !mso]><!-->
                      <tr>
                        <td height=3D15 style=3D"line-height: 4px; font-siz=
e: 4px;"></td>
                      </tr>
                      <!--<![endif]-->
                      <tr>
                        <td class=3D"subheadline space6" align=3Dcenter sty=
le=3D"color:#5F6368; font-family:&quot;Roboto&quot;, OpenSans, &quot;Open S=
ans&quot;, Arial, sans-serif; font-size:16px; font-weight:normal; line-heig=
ht:24px; margin:0; padding:0 80px 0 80px; text-align:center; word-break:nor=
mal;direction:ltr;" dir=3Dltr>Review and change your privacy and security o=
ptions to make <span style=3D"white-space:nowrap; " class=3D"">Google</span=
> work better <span style=3D"white-space:nowrap; " class=3D"">for you.</spa=
n></td>
                      </tr>
                      <tr><td height=3D30></td></tr>
                      <tr>
                          <td align=3Dcenter valign=3Dtop>
                              <table role=3Dpresentation>
                                  <tr>
                                      <td style=3D"text-align: center; padd=
ing-top: 0;">
                                          <div>
                                              <!--[if mso]>
                                                <v:roundrect xmlns:v=3D"urn=
:schemas-microsoft-com:vml" xmlns:w=3D"urn:schemas-microsoft-com:office:wor=
d" href=3D"https://notifications.google.com/g/p/ANiao5q4gSmpkbbnV5XZurorqox=
q0A1Vbmc9C0vqidtHZtwQc8PDLwqQK2Ge5ufvuY5IN_4zb6r70i_ceXt9nrSV0HiMYN5vikcQfT=
uP2yGxlD1wjSQjy_kUi30Dzh5J4iQ84WkeoNSOenAi4rN1FY2WILj8mE02SCrhHCPJnR5lk2Fmd=
LQ8aAJBtLSM-efd6V-Zr4BiHYf7NVrzkIivcqmQPHE7BrHfCt2Yys4QUQBhfBunTANepAjnr5fk=
nhjQXztazEOoNcOwhrSC6BScPu7QOpVLR9srYwm99GnjYWGAr4TWKYFihbwm4npsjsiWp0__Ggp=
Ogstcrzr1XGMdZw" style=3D"height:48px; v-text-anchor:middle; width:188px;" =
arcsize=3D"10%" strokecolor=3D"#1A73E8" fillcolor=3D"#1A73E8;">
                                                <w:anchorlock/>
                                                <center style=3D"color:#fff=
fff;font-family:Google Sans, Roboto, Arial; font-size:16px; font-weight:nor=
mal; word-break:normal;direction:ltr;" dir=3D"ltr">Confirm</center>
                                                </v:roundrect>
                                              <![endif]-->
                                             =20
                                            <!--[if !mso]><!-->
                               <a href=3Dhttps://notifications.google.com/g=
/p/ANiao5q4gSmpkbbnV5XZurorqoxq0A1Vbmc9C0vqidtHZtwQc8PDLwqQK2Ge5ufvuY5IN_4z=
b6r70i_ceXt9nrSV0HiMYN5vikcQfTuP2yGxlD1wjSQjy_kUi30Dzh5J4iQ84WkeoNSOenAi4rN=
1FY2WILj8mE02SCrhHCPJnR5lk2FmdLQ8aAJBtLSM-efd6V-Zr4BiHYf7NVrzkIivcqmQPHE7Br=
HfCt2Yys4QUQBhfBunTANepAjnr5fknhjQXztazEOoNcOwhrSC6BScPu7QOpVLR9srYwm99GnjY=
WGAr4TWKYFihbwm4npsjsiWp0__GgpOgstcrzr1XGMdZw target=3D_blank dir=3Dltr sty=
le=3D"text-align: center; display: inline-block;">
<table role=3Dpresentation cellspacing=3D0 cellpadding=3D0 align=3Dcenter>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 4px; border-top-left-radius: 4px;border-top-right-radi=
us: 4px;display:inline-block; -webkit-text-size-adjust:none;mso-hide:all;te=
xt-align: center;"></td></tr>
        <tr>
            <td class=3D"subheadline btn_mod4_mobile enwid" style=3D"backgr=
ound-color:#1A73E8;; border:1px solid #1A73E8; border-radius:4px; color:#ff=
ffff; display:inline-block; font-family:Google Sans, Roboto, Arial; font-si=
ze:16px; line-height:25px; text-decoration:none;  padding:7px 24px 7px 24px=
; -webkit-text-size-adjust:none; mso-hide:all; font-weight:500; text-align:=
 center; word-break:normal;  direction:ltr; min-width: 159px;">
Confirm
</td>
            </tr>
    <tr style=3D"padding: 0; margin: 0; font-size: 0; line-height: 0;"><td =
style=3D"border-top: 3px; display:inline-block;border-bottom-left-radius: 4=
px;border-bottom-right-radius: 4px; -webkit-text-size-adjust:none;mso-hide:=
all;text-align: center;"></td></tr>
</table></a>
                               <!--<![endif]-->
                                          =20
                                            </div>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr><td height=3D50></td></tr>
                    </table>
                  </td>
                </tr>


          <tr><td height=3D24></td></tr>
          <tr>
              <td width=3D480 style=3D"-webkit-font-smoothing: antialiased;=
 -webkit-text-size-adjust: none; -ms-text-size-adjust: 100%; border: 2px so=
lid #DFE1E5; border-radius: 8px;">
                    <table role=3Dpresentation border=3D0 cellspacing=3D0 c=
ellpadding=3D0 width=3D100%>
                           =20
                            <tr>
                                <td style=3D"font-size:0pt; line-height:0pt=
; padding:0; margin:0;" width=3D24></td>
                                <!--[if mso]>
                                <td style=3D"margin-bottom:67px; padding: 2=
1px 10px 35px 20px;">    <img role=3D"presentation" class=3D"fa_mobile" wid=
th=3D"24" height=3D"24" border=3D"0" src=3D"https://www.gstatic.com/gumdrop=
/files/help-outline.png" style=3D"width: 24px; height:24px; text-align: cen=
ter; border: none; font-size:3px;">
</td>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <td style=3D"padding: 47px 10px 40px 20px;"=
 valign=3Dtop>    <img role=3Dpresentation class=3Dfa_mobile width=3D24 hei=
ght=3D24 border=3D0 src=3Dhttps://www.gstatic.com/gumdrop/files/help-outlin=
e.png style=3D"width: 24px; height:24px; text-align: center; border: none; =
font-size:3px;">
</td>
                                <!--<![endif]-->
=09
                                <td valign=3Dtop>
                                    <!--[if mso]>
                                    <div class=3D"device_txt" style=3D"marg=
in-bottom:15px; padding-left: 20px; color:#202124; font-family:Google Sans,=
 Roboto, Arial; font-size:18px; line-height:28px; text-align:left; padding-=
top:18px; padding-bottom:12px; word-break:normal;direction:ltr;" dir=3D"ltr=
" valign=3D"top">Find answers</div>
                                    <![endif]-->
                                    <!--[if !mso]><!-->
                                    <div class=3Ddevice_txt style=3D"paddin=
g-left: 20px; color:#202124; font-family:Google Sans, Roboto, Arial; font-s=
ize:18px; line-height:28px; text-align:left; padding-top:45px; padding-bott=
om:12px; word-break:normal;direction:ltr;" dir=3Dltr valign=3Dtop>Find answ=
ers</div>
                                    <!--<![endif]-->

                                    <!--[if mso]>
                                    <div class=3D"subheadline space7" style=
=3D"margin-bottom:20px; padding-left: 20px; padding-right: 20px; color:#5F6=
368; font-family:Roboto, OpenSans, Open Sans, Arial, sans-serif; font-weigh=
t: normal; font-size:16px; line-height:24px; text-align:left; padding-botto=
m:50px; word-break:normal;direction:ltr;" dir=3D"ltr" valign=3D"top">Visit =
the <a class=3D"tstt" href=3D"https://notifications.google.com/g/p/ANiao5pO=
3pbmcSOI49waE0mhr7eSG-cWYRhPIUpyso8vu9stItzDReJkUmpcOKWkbGHyhyyKx-p0mJ6v0aU=
r-_AxAVQO-nqHiylFlRU5rW9QZ20WmZj5odEAPyG_9LAhBSMRPoqmLurqprssEoMLDd5YERk4Ye=
VnklF5THcsWjf81trKYuQAkDyjsyPBd284D33AhMgCYWvE8QBP4hPQkxhgFCzaHrJHtzblSGCCN=
krr9_px9AhRBff7uaRIA_-juGLvk-12J1sdOFovGvYzB-28CRSHAIjg4iMPNB0dflguxj-0mg" =
target=3D"_blank" style=3D"color:#1A73E8; text-decoration:none; font-weight=
:normal; border:0; ; white-space: normal; text-decoration: underline;"> Hel=
p Centre</a> to learn all about your new Google Account.</div>
                                    <![endif]-->
                                    <!--[if !mso]><!-->
                                    <div class=3D"subheadline space7 tst4" =
style=3D"padding-left: 20px; padding-right: 20px; color:#5F6368; font-famil=
y:Roboto, OpenSans, Open Sans, Arial, sans-serif; font-weight: normal; font=
-size:16px; line-height:24px; text-align:left; padding-bottom:50px; word-br=
eak:normal;direction:ltr;" dir=3Dltr valign=3Dtop>Visit the <a class=3Dtstt=
 href=3Dhttps://notifications.google.com/g/p/ANiao5pO3pbmcSOI49waE0mhr7eSG-=
cWYRhPIUpyso8vu9stItzDReJkUmpcOKWkbGHyhyyKx-p0mJ6v0aUr-_AxAVQO-nqHiylFlRU5r=
W9QZ20WmZj5odEAPyG_9LAhBSMRPoqmLurqprssEoMLDd5YERk4YeVnklF5THcsWjf81trKYuQA=
kDyjsyPBd284D33AhMgCYWvE8QBP4hPQkxhgFCzaHrJHtzblSGCCNkrr9_px9AhRBff7uaRIA_-=
juGLvk-12J1sdOFovGvYzB-28CRSHAIjg4iMPNB0dflguxj-0mg target=3D_blank style=
=3D"color:#1A73E8; text-decoration:none; font-weight:normal; border:0; ; wh=
ite-space: normal; text-decoration: underline;"> Help Centre</a> to learn a=
ll about your new Google Account.</div>
                                    <!--<![endif]-->
                                </td>
                                <td style=3D"font-size:0pt; line-height:0pt=
; padding:0; margin:0;" width=3D24></td>
                            </tr>
                    </table>
              </td>
          </tr>
                  <tr>
                      <td style=3D"-webkit-font-smoothing: antialiased; -we=
bkit-text-size-adjust: none; -ms-text-size-adjust: 100%;">
                        <table role=3Dpresentation border=3D0 cellspacing=
=3D0 cellpadding=3D0 align=3Dcenter width=3D100%>
                          <tr><td height=3D30></td></tr>
                          <tr>
                            <td width=3D134 height=3D46 align=3Dcenter styl=
e=3D"font-size:8px; word-break:normal;direction:ltr;" dir=3Dltr>    <img ro=
le=3Dpresentation class=3Dgoogle_mobile width=3D82 height=3D26 border=3D0 s=
rc=3Dhttps://www.gstatic.com/gumdrop/files/google-logo-footer.png style=3D"=
width: 82px; height:26px; text-align: center; border: none;">
</td>
                          </tr>
                          <tr><td height=3D19></td></tr>
                          <tr>
                            <td class=3Dspace6 align=3Dcenter style=3D"colo=
r:#5F6368; font-family:&quot;Roboto&quot;, OpenSans, &quot;Open Sans&quot;,=
 Arial, sans-serif; font-size:12px; line-height:18px; margin:0; padding:0 8=
0px 0 80px; text-align:center; word-break:normal;direction:ltr;" dir=3Dltr>=
Replies to this email aren&#39;t monitored. If you have a question about yo=
ur new account, the <a class=3Dtstt href=3Dhttps://notifications.google.com=
/g/p/ANiao5pBhMrQnFbaWAUqH-ytRDqR0UYP_IKaOoaFURMlrR_6AKsCEvnQ_vH9TXnOtCUVAA=
JziG9SNgI40h3N-P8yKmP2YXNKWvNfFBskZTiZwrNQE-fwrDS5Fj4zB7ZsTu59UNRNetxu1Dyo3=
cTDIyAFlxQUikYszWt1Rd3YIJr2-mBV9dAwmOd-T46sXnskaea0TK_c46I_Z6dDIjrQaK2u_Z-6=
XZMixv4cB1KyIcMLi-jMe4TCm65dU4U59ZUG9NGQ3EENhk78q5BAiwMcOw_mZcSqV9rRFdDQ_pI=
-BLj3iZYRwiBseiWm-w target=3D_blank style=3D"color:#1A73E8; text-decoration=
:none; font-weight:normal; border:0; ; white-space: normal; text-decoration=
: underline;"> Help Centre</a> probably has the answer that you&#39;re look=
ing for.</td>
                          </tr>
                          <tr><td height=3D19></td></tr>
                          <tr>
                            <td class=3Dspace6 valign=3Dmiddle style=3D"col=
or:#5F6368; font-family:&quot;Roboto&quot;, OpenSans, &quot;Open Sans&quot;=
, Arial, sans-serif; font-size:10px; line-height:15px; margin:0; padding:0 =
30px 0 30px; text-align:center" align=3Dcenter>
=20

      <span style=3D"font-size:inherit; color:inherit; font-weight:inherit;=
 line-height:inherit; font-family:inherit;">Google LLC<br>1600 Amphitheatre=
 Parkway,<br>Mountain View, CA 94043</span>
  =20
  =20

<br><br><span style=3Dword-break:normal;direction:ltr; dir=3Dltr>This email=
 was sent to you because you created a Google Account.</span></td>
                          </tr>
                        </table>
                      </td>
                  </tr>
                  <tr><td height=3D18></td></tr>
        </table>
        <div style=3D"display:none; white-space:nowrap; font:15px courier; =
line-height:0;">
        =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0=C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0
        =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=
=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0 =C2=A0
        </div>
      </center>
    <img alt=3D"" height=3D1 width=3D3 src=3Dhttps://notifications.google.c=
om/g/img/ANiao5obkZOHlqjl7tGhY1o_TwiR34k40_sjhyKzifmkFUFg0fI-mSsTaHeFuabfF2=
ozqeFidLAaAZfwkR9J5HTSaL6SNgmLNE8SIXurWJj_Uz3_ziS8bZwPo8CcrlfPz09_6OQ4Fhw2F=
olT7wYXlQ.gif></body>
  </html>

--0000000000005403e7060209280f--

