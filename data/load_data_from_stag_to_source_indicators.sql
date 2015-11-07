
  begin tran;

  merge IndicatorValue as T
  using (select [IndicatorId],[CountryId],[Year],[IndicatorValue] from [IndicatorValueStag]) as S
    on  T.indicatorid = S.indicatorid
      and T.countryid = S.countryid
	  and T.year = s.year
  when matched then
    update set T.IndicatorValue = S.IndicatorValue
  when not matched then
    insert ([IndicatorId],[CountryId],[Year],[IndicatorValue]) 
    values(S.[IndicatorId],S.[CountryId],S.[Year],S.[IndicatorValue]);

commit;