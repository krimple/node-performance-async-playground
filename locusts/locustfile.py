from locust import HttpLocust, TaskSet, task

class UserBehavior(TaskSet):
    @task(1)
    def node_nonfunc(self):
        self.client.get('/nonfunctionalsum')

    @task(1)
    def node_sync_call(self):
        self.client.get('/reducenative')

    @task(1)
    def node_async_call(self):
        self.client.get('/reduceasync')

    @task(1)
    def node_ramda_blocking_call(self):
        self.client.get('/reduceramdablocking')

    @task(1)
    def node_ramda_nonblocking_call(self):
        self.client.get('/reduceramdanonblocking')

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 1000
    max_wait = 3000
