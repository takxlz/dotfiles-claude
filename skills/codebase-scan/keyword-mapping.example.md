# codebase-scan キーワードマッピング

このファイルを `keyword-mapping.local.md` にコピーして、自社環境に合わせて記入してください。
`keyword-mapping.local.md` は gitignore されているためコミットされません。

```
cp keyword-mapping.example.md keyword-mapping.local.md
```

形式: `日本語概念: 候補1, 候補2, ...`（grep 候補の優先投入元になる）。

# ドメイン用語

- （例）職員: shokuin, employee, staff, jinji # 旧コードは jinji
- （例）職員ID: shokuinId, shokuin_id, syokuinId, staffId, empId, shkId
- （例）ユーザー情報: userInfo, userJoho, userJouhou, user_info
- （例）会員: member, mb, kaiin

# 技術用語

- （例）認証トークン: authToken, token, accessToken, jwt
- （例）フィーチャーフラグ: featureFlag, flag, toggle, FEATURE_FLAG

# 略称・頭字語

- （例）mgr: manager
- （例）svc: service
- （例）repo: repository

# 命名規則メモ（参考）

マッピング表に載らない全体方針。

- （例）DB カラムは snake_case、アプリケーションコード内は camelCase
- （例）旧システムからの移行中。新規は英訳統一、レガシーはローマ字残存
- （例）エラーメッセージは日本語、ログは英語
