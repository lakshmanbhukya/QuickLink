package com.quicklink.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.quicklink.controller..*(..))")
    public Object logExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        log.info("Entering: {}.{}() with arguments = {}", className, methodName, Arrays.toString(joinPoint.getArgs()));

        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Throwable e) {
            long executionTime = System.currentTimeMillis() - start;

            log.error("Exception in {}.{}() after {} ms. Error: ", className, methodName, executionTime, e);
            throw e;
        }

        long executionTime = System.currentTimeMillis() - start;

        log.info("Exiting: {}.{}() completed in {} ms", className, methodName, executionTime);

        return result;
    }
}
