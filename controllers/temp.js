const { firebaseAdmin } = require("../index");

const app = firebaseAdmin.app();
app
  .auth()
  .verifyIdToken(
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY5N2Q3ZmI1ZGNkZThjZDA0OGQzYzkxNThiNjIwYjY5MTA1MjJiNGQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQWRhcnNoIFNyaXZhc3RhdmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2lNbjhfTEIwWU93YXoyUy1nYmlobkhUQkpTWnVKZ2MyMTJsejRzPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2ZjbS1hcHAtMjYxY2QiLCJhdWQiOiJmY20tYXBwLTI2MWNkIiwiYXV0aF90aW1lIjoxNjUyNjg0NTQ1LCJ1c2VyX2lkIjoiV1RGSkx2Q1pyOFp6ZThmdzJGdkdpNEJSTTVyMSIsInN1YiI6IldURkpMdkNacjhaemU4ZncyRnZHaTRCUk01cjEiLCJpYXQiOjE2NTI2ODQ1NDUsImV4cCI6MTY1MjY4ODE0NSwiZW1haWwiOiJhZGFyc2hzcml2YXN0YXZhLnRlY2hAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDM4Nzg0ODQ1NTU3ODQ2MDYyMjYiXSwiZW1haWwiOlsiYWRhcnNoc3JpdmFzdGF2YS50ZWNoQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.Rvdq-r2Tux7k2WeuEQ02NgF_2pyrP93G1_UiVwLUg4aH1F2HkKn8YaDGSBK8nPZI7LeZuhlQrz_iVUotULCnyxdNqI9ZmNgolJqdM94G1HXmQIFiuOCZ4aF9BsEKii1tcpAewLQ52ij-6kTD4az-EWzYkNFF8z3B3rvIiSzy6Nerj8Oj1UecZyW3uTCJhRteeQTIcMUAHCaroK6rxNE8T_k6ZXfxQi6081ka1MygyQSb55Tpdgk5zTGT5uHefwpejme8BnZaCNtRPVJEwLhHCICmuq1CD5hnkIHailNRP4TDxqwwU0xmwfkNYurQYmEsrkDu_7Vzq9zDi_2CLM2fcQ"
  )
  .then((idToken) => console.log(idToken))
  .catch((err) => console.error(err));
