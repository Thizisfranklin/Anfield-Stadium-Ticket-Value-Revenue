import numpy as np

def compare(d):
    a=d[d.season.eq('2024-25')]; b=d[d.season.eq('2025-26')]
    paired=a[['opponent','unused_tickets']].merge(b[['opponent','unused_tickets']],on='opponent',validate='one_to_one',suffixes=('_before','_after'))
    delta=(paired.unused_tickets_after-paired.unused_tickets_before).to_numpy()
    rng=np.random.default_rng(42)
    boot=rng.choice(delta,size=(10000,len(delta)),replace=True).mean(axis=1)
    change=float(b.unused_tickets.mean()-a.unused_tickets.mean())
    return dict(before_mean=round(float(a.unused_tickets.mean()),4),after_mean=round(float(b.unused_tickets.mean()),4),
                absolute_change=round(change,4),relative_change_pct=round(change/a.unused_tickets.mean()*100,4),
                comparable_opponents=len(paired),paired_mean_change=round(float(delta.mean()),4),
                paired_bootstrap_95=[round(float(x),2) for x in np.quantile(boot,[.025,.975])],
                ga_st_reported_change_pct=-23,
                caution='Definition-sensitive descriptive contrast: 2024-25 says all stadium tickets; 2025-26 says home tickets. Scope equivalence is unconfirmed. The bootstrap reflects opponent resampling only, not measurement uncertainty or a causal effect.')
