
  begin tran;

  merge BankProject as T
  using (select [CountryCode]
      ,[ProjectId]
      ,[ProjectName]
      ,[ApprovalDate]
      ,[Amount]
      ,[ProjectType]
      ,[ProjectLink]
      ,[ProjectStatus] from BankProjectStag where countrycode != '') as S
    on  T.projectid = S.projectid
  when matched then
    update set T.[CountryCode]	 = S.[CountryCode]
			  ,T.[ProjectName]	 = S.[ProjectName]
			  ,T.[ApprovalDate]	 = S.[ApprovalDate]
			  ,T.[Amount]			 = S.[Amount]
			  ,T.[ProjectType]	 = S.[ProjectType]
			  ,T.[ProjectLink]	 = S.[ProjectLink]
			  ,T.[ProjectStatus]	 = S.[ProjectStatus]
  when not matched then
    insert ([CountryCode]
      ,[ProjectId]
      ,[ProjectName]
      ,[ApprovalDate]
      ,[Amount]
      ,[ProjectType]
      ,[ProjectLink]
      ,[ProjectStatus]) 
    values(
	   S.[CountryCode]
      ,S.[ProjectId]
      ,S.[ProjectName]
      ,S.[ApprovalDate]
      ,S.[Amount]
      ,S.[ProjectType]
      ,S.[ProjectLink]
      ,S.[ProjectStatus]);

commit;