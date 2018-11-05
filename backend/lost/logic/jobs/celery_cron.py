import traceback
import logging
import os
from datetime import datetime, timedelta

try:
    from lost.db import access
    from lost.logic.pipeline import cron
    from lost.logic import config
    from lost.db.access import DBMan
    from lost.db import state
except:
    logging.error(traceback.format_exc())

def exec_pipe():
    lostconfig = config.LOSTConfig()
    dbm = DBMan(lostconfig)
    pipe_list = dbm.get_pipes_to_process()
    # For each task in this project
    for p in pipe_list:
       pipe_man = cron.PipeMan(dbm=dbm, pipe=p, lostconfig=lostconfig)
       pipe_man.process_pipeline()

def release_annos():
    lostconfig = config.LOSTConfig()
    dbm = DBMan(lostconfig)
    __release_project_annos(dbm)


def __release_project_annos(dbm):
    present = datetime.now()
    unlock_time = present - timedelta(hours=2)
    for anno_task in dbm.get_anno_task(state=state.AnnoTask.IN_PROGRESS):
        for anno in dbm.get_locked_img_annos(anno_task.idx):
            if anno.timestamp_lock < unlock_time:
                anno.state = state.Anno.UNLOCKED
                dbm.add(anno)
        for anno in dbm.get_locked_bbox_annos(anno_task.idx):
            if anno.timestamp_lock < unlock_time:
                anno.state = state.Anno.UNLOCKED
                dbm.add(anno)
        dbm.commit()