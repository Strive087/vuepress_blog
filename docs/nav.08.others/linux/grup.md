# 添加win10引导

很简单，走完这三步就行，我的是centos7.8:

1. wget -O /etc/yum.repos.d/epel.repo <http://mirrors.aliyun.com/repo/epel-7.repo>

2. yum install ntfs-3g

3. grub2-mkconfig -o /boot/grub2/grub.cfg