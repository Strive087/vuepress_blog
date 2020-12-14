# 定时关机

```sh
格式：  
*  *  * *  *  command  
分 时 日 月 周  命令  
```

例子：

```sh
1、crontab -e 回车  
2、添加任务，并保存  
#每天23:00定时关机  
58 22 * * * /sbin/shutdown -h 23:00  
3、查看任务列表  
crontab -l  
```

紧急取消：

```sh
sudo shutdown -c
```

取消定时任务：

直接crontab -e 进入编辑器删除任务指令即可。
