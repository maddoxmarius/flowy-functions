import * as functions from "firebase-functions";
import {logger} from "firebase-functions";

/**
 * Records a successfull pomodoro
 *
 * @return {functions.tasks.TaskQueueFunction} cloudFunction : cloud function
 */
export function pomodoroTaskOperation():
functions.tasks.TaskQueueFunction {
  return functions
      .tasks.taskQueue({
        retryConfig: {
          maxAttempts: 5,
          minBackoffSeconds: 60,
        },
        rateLimits: {
          maxConcurrentDispatches: 6,
        },
      })
      .onDispatch(
          (data: any) => {
            logger.info("Dispatching task", data);
          }
      );
}
