#!/usr/bin/env python
from setuptools import setup
import sys


VERSION = open('version.txt').read()[:-1]


setup(
    name='pyeiol',
    version=VERSION,
    description='Python EasyInterface Output Language lib',
    long_description=open("README.md").read(),
    author='Jesus Domenech',
    author_email='jdomenec@ucm.es',
    url='https://github.com/abstools/easyinterface/outputlanguage/python',
    download_url ='https://github.com/abstools/easyinterface/archive/eiol_python_{}.tar.gz'.format(VERSION),
    license='GPL v3',
    platforms=['any'],
    packages=['eiol'],
    package_dir={'eiol': 'eiol'},
    package_data={'eiol': ['*.py']},
    install_requires=[],
    classifiers=[
        "License :: OSI Approved :: GNU General Public License v3 (GPLv3)",
        "Programming Language :: C++",
        "Programming Language :: Python",
        "Development Status :: 3 - Alpha",
        "Operating System :: Unix",
        "Intended Audience :: Science/Research",
        "Programming Language :: Python :: 2",
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6'
    ],
    keywords=['EasyInterface', 'Output Languages', 'static analysis'],
)
