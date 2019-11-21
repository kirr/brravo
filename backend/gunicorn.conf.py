import multiprocessing

# workers = min(multiprocessing.cpu_count() * 2 + 1, 7)
workers = 1
worker_class = 'gevent'
raw_env = ['GEVENT_RESOLVER=ares']
# user = 'service'
timeout = 90
