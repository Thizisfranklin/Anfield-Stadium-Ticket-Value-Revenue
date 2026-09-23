"""Small, fixed-specification benchmark with forward-only, within-season evaluation."""
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, root_mean_squared_error

FEATURES=['weekend','kickoff_hour','restricted_ballot']

def evaluate(d):
    # Use only 2025-26: eliminates ambiguous cross-season target scope.
    data=d[d.season.eq('2025-26')].sort_values('date').reset_index(drop=True)
    records=[]
    for cut in [10,13,16]:
        train=data.iloc[:cut]; test=data.iloc[cut:cut+3]
        assert train.date.max()<test.date.min()
        model=make_pipeline(StandardScaler(),Ridge(alpha=10))
        model.fit(train[FEATURES].astype(float),train.unused_tickets)
        predictions={'expanding_mean':np.repeat(train.unused_tickets.mean(),len(test)),
                     'last_fixture':np.repeat(train.unused_tickets.iloc[-1],len(test)),
                     'ridge_context':np.clip(model.predict(test[FEATURES].astype(float)),0,None)}
        for name, values in predictions.items():
            for (_,row),pred in zip(test.iterrows(),values,strict=True):
                records.append(dict(model=name,fold=cut,train_end=train.date.max(),test_date=row.date,
                                    fixture_id=row.id,actual=int(row.unused_tickets),prediction=round(float(pred),4)))
    p=pd.DataFrame(records)
    scores=[]
    for name,g in p.groupby('model'):
        scores.append(dict(model=name,mae=round(mean_absolute_error(g.actual,g.prediction),2),
                           rmse=round(root_mean_squared_error(g.actual,g.prediction),2),n_test=len(g)))
    gaps=pd.to_datetime(data.date).diff().dt.days.dropna()
    return {'scores':scores,'features':FEATURES,'train_season':'2025-26','n_available':len(data),
            'interval_days_min':int(gaps.min()),'interval_days_max':int(gaps.max()),
            'decision':'Exploratory benchmark only. Nineteen irregular fixtures in a consistent target scope cannot establish annual seasonality or reliable stationarity. No ARIMA/SARIMA or operational future forecast is fitted.',
            'validation':'Three expanding windows, 10/13/16 training fixtures, next 3 fixtures each. Fixed alpha=10; no tuning on test data. Nine unique held-out fixtures. Baselines recalculated using training only.'},p
