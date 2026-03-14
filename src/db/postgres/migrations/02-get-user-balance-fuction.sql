CREATE OR REPLACE FUNCTION get_user_balance(uid UUID)
RETURNS TABLE(
	earnings NUMERIC(10,2),
	expenses NUMERIC(10,2),
	investment NUMERIC(10,2),
	balance NUMERIC(10,2)
) AS $$
BEGIN
	RETURN QUERY
	SELECT
	    COALESCE(SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END),0) AS earnings,
	    COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),0) AS expenses,
	    COALESCE(SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END),0) AS investment,
	    COALESCE(SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END),0)
	    - COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),0)
	    - COALESCE(SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END),0) AS balance
	FROM transactions
	WHERE user_id = uid;
END;
$$ LANGUAGE plpgsql;